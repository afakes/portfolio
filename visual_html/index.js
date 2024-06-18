
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
        for (let [section_number, section] of this.data.entries()) {
            section.section_number = section_number;
            content += this.renderSection(section);
        }
        content += `</div>`;
        main.innerHTML = content;  // render content to main
    }

    renderSection(section = {}) {

        // log section
        console.log(`section ${section.type}`);
        console.log(section);

    
        let image_content = "";
        if (section.image) {
            
            image_content += `<img src="${section.image}" alt="image" class="image">`;

            // if summary is present, and it contains " | " then convert to key_values
            if (section.summary && section.summary.includes(" | ")) {

                let summary_key_values = [];
                let raw_key_values = section.summary.split(" | ");
                for (let raw_key_value of raw_key_values) {
                    summary_key_values.push(
                        {"key":"", "value": raw_key_value}
                    )
                }
                
                section.key_value = summary_key_values;
                section.summary = null;
            }


        }


        let text_content = "";
        if (section.title)      { text_content += `<h1>${section.title}</h1>`; }
        if (section.heading)    { text_content += `<h2>${section.heading}</h2>`;}
        if (section.subheading) { text_content += `<h3>${section.subheading}</h3>`; }
        if (section.summary)    { text_content += `<h4>${section.summary}</h4>`; }        
        if (section.key_value)  { text_content += this.renderKeyValues(section.key_value); }
        for (let article of (section.articles || [])) {
            text_content += this.renderArticle(article);
        }

        
        let content = `<section id="${section.type}">`;
        
        if (image_content == "") {
            content += text_content;    
        } else {
            content += `<div class="left_right">`;
            content += image_content;
            content += `<div class="text">${text_content}</div>`;
            content += `</div>`;
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
    
}