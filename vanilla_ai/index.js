
//  create class PageManager
class PageManager {
 
    constructor() {
        this.dataURL = "https://raw.githubusercontent.com/afakes/resume/master/resume.json";
        this.data = null;
    }
    
    //  create method main
    async main() {
        this.data = await this.fetchData(this.dataURL);  //  call fetchData
        if (!this.data) {
            console.error("Failed to load data");
            return;
        }
        
        this.render();

        this.add_rewrite_icons();

        this.scrollToSection();
    }



    getSectionNameFromURL() {
        // find # in window.location.href
        if (!window.location.href.includes("#")) { return null; }
        return window.location.href.split("#")[1];
    }    


    scrollToSection() {
        let initialSectionName = this.getSectionNameFromURL();
        if (initialSectionName == null) { return; }
        
        let sectionElement = document.getElementById(initialSectionName);
        if (sectionElement == null) { return; }

        sectionElement.scrollIntoView();
    }


    render() {
        let main = document.getElementById("container");
        if (main === null) { return;}

        let content = `<div>`;
        for (let section of this.data) {
            content += this.renderSection(section);
        }
        content += `</div>`;
        main.innerHTML = content;  // render content to main
    }

    /**
     * fetch bedrock result for section text
     * @param {*} section 
     */
    async rewrite_with_bedrock(section = null) {

        // check if section is null
        if (section == null) { return null; }

        if (!("articles" in section)) { return null; }

        // get first article 
        let articles = (section.articles || [])
        if (articles.length == 0) { return null; }
        
        let article = articles[0];
        let points = article.points || [];

        // join points to create text
        let text = points.join(" ");

        let prompt_text = `please rewrite and expand the following to appeal to a Technology Recruiter '${text}'`;

        let result = await this.fetchPostData(bedrock_endpoint, prompt_text);
        if (result == null) { return null; }

        if (!("type" in result)) { return null; }
        return result.result;
    }

    renderSection(section = {}) {

        // rewrite section with bedrock
        // if (section.type == "summary") {
        //     this.rewrite_with_bedrock(section);
        // }

        // log section
        console.log(`section ${section.type}`);
        console.log(section);

        let content = `<section id="${section.type}">`;

        if (section.title)      { content += `<h1>${section.title}</h1>`; }
        if (section.heading)    { content += `<h2>${section.heading}</h2>`;}
        if (section.subheading) { content += `<h3>${section.subheading}</h3>`; }
        if (section.summary)    { content += `<h4>${section.summary}</h4>`; }
        
        for (let article of (section.articles || [])) {
            content += this.renderArticle(article);
        }

        content += `</section>`;
        return content;
    }


    renderArticle(article = {}) {

        let content = `<article>`;

        if (article.title)      { content += `<h1>${article.title}</h1>`; }
        if (article.heading)    { content += `<h2>${article.heading}</h2>`;}
        if (article.subheading) { content += `<h3>${article.subheading}</h3>`; }
        if (article.summary)    { content += `<h4>${article.summary}</h4>`; }

        content += this.renderKeyValues(article.key_value);
        
        if (article.points) {
            content += `<ul>`;
            for (let point of article.points) { content += `<li>${point}</li>`;}
            content += `</ul>`;
        }

        content += `</article>`;

        return content;
    }

    renderKeyValues(key_values = []) {
            
        let content = `<ul class="key_value">`;

        for (let key_value of (key_values || [])) {

            let value = key_value.value;

            // if value starts with http, then create a link
            if (value.startsWith("http")) {
                let link = value;
                let text = value;

                // remove end slash from text
                if (text.endsWith("/")) { text = text.substring(0, text.length - 1); }

                text = text.replace("http://", "").replace("https://", "");
                value = `<a target="_new" href="${link}">${text}</a>`;
            }

            content += `<li><span class="key">${key_value.key}</span><span class="value">${value}</span></li>`;
        }

        content += `</ul>`;
        return content;
    
    }

    //  create method fetchData
    async fetchData(url = null) {

        let response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch data from ${url}`);
            return null;
        }
        try {
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    //  create method fetch post data
    async fetchPostData(url = null, data = {}) {

        if (url == null) { return null; }


        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            console.error(`Failed to fetch data from ${url}`);
            return null;
        }
        
        let result = null;

        try {
            result = await response.text();
        } catch (error) {
            console.error(error);
            return null;
        }

        try {
            return {
                "result": JSON.parse(result),
                "type": "json"
            };
        } catch (error) {
            return {
                "result": result,
                "type": "text"
            };
        }
    }
    

    add_rewrite_icons() {

        let articles = document.querySelectorAll("article");

        for (let article of articles) {

            // find h2 in article
            let h2 = article.querySelector("h2");
            if (h2 == null) { continue; }

            // create icon
            let icon = document.createElement("i");
            icon.classList.add("fas", "fa-sync-alt", "rewrite");
            icon.title = "Rewrite using AWS Bedrock AI";

            // append icon to end of h2
            h2.appendChild(icon);

            // add onclick event to icon
            icon.onclick = async () => {
                this.article_rewrite(icon);
            };

        }
    }

    async article_rewrite(element = null) {

        // check if element is null
        if (element == null) { return; }

        // get article from element
        let article = element.closest("article");
        if (article == null) { return; }

        // get article text content coming from the content of the UL as text
        let point_elements = article.querySelectorAll("li");

        let source_points = [];
        for (let point_element of point_elements) {
            source_points.push(point_element.innerText);
            
            // set point_element as disabled
            point_element.style.color = "light gray";
            point_element.classList.add("rewriting");
        }

        let text = source_points.join("\n");

        let prompt_text = `please rewrite and expand the following to appeal to a Technology Recruiter '${text}'`;

        let raw_result = await this.fetchPostData(bedrock_endpoint, prompt_text);
        if (raw_result == null) { return null; }

        if (!("type" in raw_result)) { return null; }
        
        let result = raw_result.result;

        // if result starts with quote remove it
        if (result.startsWith('"')) { result = result.substring(1); }

        // if result ends with quote remove it
        if (result.endsWith('"')) { result = result.substring(0, result.length - 1); }

        
        // loop through result and split by new line
        let new_points = [];
        for (let line of result.split("\n")) {
            line = line.trim();
            if (line == "") { continue; }
            new_points.push(line);
        }


        // get ul element
        let ul = article.querySelector("ul");
        if (ul == null) { return; }

        // remove all li elements from ul
        for (let point_element of point_elements) {
            point_element.remove();
        }


        // loop through new_points and add li elements to ul
        for (let new_point of new_points) {
            let li = document.createElement("li");
            li.innerText = new_point;
            ul.appendChild(li);
        }


    }

    // add_rewrite_icons() {
        
    //     let articles = document.querySelectorAll("article");
        
    //     for (let article of articles) {
    //         let icon = document.createElement("i");
    //         icon.classList.add("fas", "fa-sync-alt", "rewrite");
    //         icon.onclick = async () => {
    //             let text = article.innerText;
    //             let result = await this.fetchPostData(bedrock_endpoint, text);
    //             if (result == null) { return; }
    //             article.innerHTML = result.result;
    //         };
    //         article.appendChild(icon);
    //     }

    // }

}