
class ResumeKeyValues extends HTMLElement {

    constructor() {
        super();
        this.section = null;
        this.article = null;
        this.data = null;
    }

    // get method for key_values from this.data
    get keyValues() {
        if (!this.data) { return []; }
        return this.data;
    }

    // methodf to call after being inserted into DOM
    connectedCallback() {
        this.render();
    }

    render() {
        let element = Object.assign(document.createElement("ul"), { class: "key_value", innerHTML: this.asHTML()});
        this.appendChild(element);
    }

    /**
     * create HTML content from key_values
     * we are using HTML to create the content
     * @returns {string} content
     */
    asHTML() {
        let content = "";
        for (let key_value of this.keyValues) {
            let value = key_value.value;
            // if value starts with http, then create a link
            if (value.startsWith("http")) {
                let link = value;
                let text = value;
                if (text.endsWith("/")) { text = text.substring(0, text.length - 1); } // remove end slash from text
                text = text.replace("http://", "").replace("https://", "");
                value = `<a target="_new" href="${link}">${text}</a>`;
            }
            content += `<li><span class="key">${key_value.key}</span><span class="value">${value}</span></li>`;
        }
        return content;
    }


}
window.customElements.define('resume-key-values', ResumeKeyValues);


class ResumePoints extends HTMLElement {

    constructor() {
        super();
        this.section = null;
        this.article = null;
        this.data = null;
    }

    // get method for points from this.data
    get points() {
        if (!this.data) { return []; }
        return this.data;
    }

    // method to call after being inserted into DOM
    connectedCallback() {
        this.render();
    }

    render() {
        let element = Object.assign(document.createElement("ul"), { class: "points", innerHTML: this.asHTML()});
        this.appendChild(element);
    }

    /**
     * create HTML content from key_values
     * we are using HTML to create the content
     * @returns {string} content
     */
    asHTML() {
        let content = "";
        for (let point of this.points) {
            content += `<li>${point}</li>`;            
        }
        return content;
    }


}
window.customElements.define('resume-points', ResumePoints);



class ResumeArticle extends HTMLElement {

    constructor() {
        super();
        this.section = null;
        this.data = null;
    }

    // method to call after being inserted into DOM
    connectedCallback() {
        this.render();
    }

    // get method for type from this.data
    get sectionType() {
        if (!this.section) { return null; }
        return this.section.sectionType;
    }

    // get method for heading from this.data
    get heading() {
        if (!this.data) { return null; }
        return (this.data || {}).heading || null;
    }

    // get method for subheading from this.data
    get subheading() {
        if (!this.data) { return null; }
        return (this.data || {}).subheading || null;
    }

    // get method for summary from this.data
    get summary() {
        if (!this.data) { return null; }
        return (this.data || {}).summary || null;
    }

    // get method for date from this.data
    get dates() {
        if (!this.data) { return null; }
        return (this.data || {}).date || null; // note date is the key in the json file
    }
    
    // get method for points from this.data
    get points() {
        if (!this.data) { return []; }
        return (this.data || {}).points || [];
    }

    // get method for key_values from this.data
    get keyValues() {
        if (!this.data) { return []; }
        return (this.data || {}).key_value || [];  // note key_value is the key in the json file
    }


    // method to render the content, hewre we are using createElement to create the content
    render() {
                
        if (this.heading)    { this.appendChild(Object.assign(document.createElement("h2"), { innerText: this.heading })); }
        if (this.subheading) { this.appendChild(Object.assign(document.createElement("h3"), { innerText: this.subheading })); }
        if (this.summary)    { this.appendChild(Object.assign(document.createElement("h4"), { innerText: this.summary })); }        

        let rkv = new ResumeKeyValues(); // create ResumeKeyValues just to get the tagname
        let keyValueElement = document.createElement(rkv.tagName);
        keyValueElement.section = this.section;
        keyValueElement.article = this;
        keyValueElement.data = this.keyValues;
        this.appendChild(keyValueElement);


        let rp = new ResumePoints(); // create ResumePoints just to get the tagname
        let pointsElement = document.createElement(rp.tagName);
        pointsElement.section = this.section;
        pointsElement.article = this;
        pointsElement.data = this.points;
        this.appendChild(pointsElement);        
    }
}
window.customElements.define('resume-article', ResumeArticle);


class ResumeSection extends HTMLElement {

    constructor() {
        super();
        this.data = null;
        
    }

    // method to call after being inserted into DOM
    connectedCallback() {
        this.render();
    }

    // get method for type from this.data
    get sectionType() {
        if (!this.data) { return null; }
        return (this.data || {}).type || null;
    }

    // get method for title from this.data
    get title() {
        if (!this.data) { return null; }
        return (this.data || {}).title || null;
    }

    // get method for heading from this.data
    get heading() {
        if (!this.data) { return null; }
        return (this.data || {}).heading || null;
    }

    // get method for subheading from this.data
    get subheading() {
        if (!this.data) { return null; }
        return (this.data || {}).subheading || null;
    }

    // get method for summary from this.data
    get summary() {
        if (!this.data) { return null; }
        return (this.data || {}).summary || null;
    }

    // get method for articles from this.data
    get articles() {
        if (!this.data) { return []; }
        return (this.data || {}).articles || [];
    }


    render() {

        if (this.title)      { this.appendChild(Object.assign(document.createElement("h1"), { innerText: this.title })); }
        if (this.heading)    { this.appendChild(Object.assign(document.createElement("h2"), { innerText: this.heading })); }
        if (this.subheading) { this.appendChild(Object.assign(document.createElement("h3"), { innerText: this.subheading })); }
        if (this.summary)    { this.appendChild(Object.assign(document.createElement("h4"), { innerText: this.summary })); }        


        let ra = new ResumeArticle(); // create ResumeArticle just to get the tagname
    
        for (let article of this.articles ) {
            let articleElement = document.createElement(ra.tagName); // create articleElement
            articleElement.section = this;
            articleElement.data = article;
            this.appendChild(articleElement);
         }

    }
}
window.customElements.define('resume-section', ResumeSection);


//  create class PageManager
class PageManager {
 
    constructor() {
        this.dataURL = "../data/resume.json";
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

        // get tag anem from ResumeSection
        let rs = new ResumeSection();

        for (let section of this.data) {

            let sectionElement = Object.assign(document.createElement(rs.tagName), { "id": section.type })
            sectionElement.data = section;
            
            main.appendChild(sectionElement);
        }
        
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





