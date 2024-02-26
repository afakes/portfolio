
// create class to manage page functions
class PageManager {

    // constructor
    constructor() {
        this.data = null;
    }
    
    get pageTitle() {
        return this._pageTitle;
    }
    set pageTitle(value) {
        this._pageTitle = value;
    }

    async main() {
        console.log("main");

        this.data = await PM.loadJSON();
        
        this.updateContent('head title', this.data.page.title);
        this.updateContent('.heading', this.data.header.name);
        this.updateContent('.subheading', this.data.header.subheading);
        
        this.updateContent('.motto', this.data.header.motto);
        this.updateContent('.introduction', this.data.header.introduction);

        this.updatePresence();
        this.updateEducation();
        this.updateSkills();
        this.updateExperience();

    }

    updateEducation() {
        let html = "";
        for (let education of this.data.education) {
            html += `<li><span>${education.year}</span><span>${education.name}</span></li>`;
        }
        // body > main > section.education > ul
        this.updateContent('body > main > section.education > ul', html);
    }

    updatePresence() {
        let html = "";
        for (let contact of this.data.contacts) {
            html += `<li><span>${contact.name}</span><span>${contact.value}</span></li>`;
        }

        this.updateContent('.contact > ul', html);
    }


    updateSkills() {
        let html = "";
        for (let skill of this.data.skills) {

            html += `<li><span>${skill.level.toFixed(1)}</span><span>${skill.years}</span><span>${skill.name}</span></li>`;
        }
        // body > main > section.education > ul
        this.updateContent('body > main > section.skills > ul', html);
    }

    updateExperience() {
        
        let html = "";

        let toc = [];

        let points_html = "";
        for (let experience of this.data.experience) {

            points_html = "";
            for (let point of experience.points) {
                points_html += `<li>${point}</li>`;
            }
    
            //  create tag from title and organisation, removing all spaces
            let tag = experience.title + experience.organisation;
            tag = tag.replace(/\s/g, '');

            toc.push({"tag": tag, "title": `${experience.title} (${experience.organisation})`});

            html += `
            <li>
                <h1><a id="#${tag}"></a>${experience.title}</h1>
                <h2><span>${experience.organisation}</span><span>${experience.location}</span></h2> 
                <h3><span>${experience.date.from}</span><span>${experience.date.to}</span></h3> 
                <ul>
                    ${points_html}
                </ul>
            </li>`;
        }

        // body > main > section.education > ul
        this.updateContent('body > main > section.experience > ul', html);
    }



    updateContent(selector, content) {

        let element = document.querySelector(selector);
        if (!element) {
            console.error("Element not found: " + selector);
            return;
        }

        document.querySelector(selector).innerHTML = content;
    }

    // add event listeners
    addEventListeners() {
        // add event listener for the button
        // document.getElementById("btn").addEventListener("click", this.buttonClicked);
    }

    // load json file assets/resume.json
    async loadJSON() {
        let response = null;
        try {
            response = await fetch('assets/resume.json');
        } catch (error) {
            console.error(error);
            return;
        }

        try {
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

}

