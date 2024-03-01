
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

    makeLinks() {   
        // find all elements where text contains https:// or http://

        let elements = document.querySelectorAll('.contact *');
        for (let element of elements) {
            if (element.textContent.includes('http://') || element.textContent.includes('https://')) {
                let text = element.textContent;

                // log text
                console.log(text);

                let link = `<a href="${text}">${text}</a>`;
                // element.innerHTML = link;
            }
        }
        
    }

    updateEducation() {
        let html = "";
        for (let education of this.data.education) {
            html += `
            <div class="single_education">
                <div class="first">${education.award}</div> 
                <div class="second">${education.subject}</div> 
                <div class="third">${education.name} (${education.year})</div>
            </div>
            `;
        }
        // body > main > section.education > ul
        this.updateContent('.education', html);
    }

    updatePresence() {
        let html = "";
        for (let contact of this.data.contacts) {

            let value = contact.value;
            // if value is a link
            if (value.includes('http://') || value.includes('https://')) {
                value = `<a target="_${contact.name}" href="${value}">${value}</a>`;
            }

            html += `<li><span>${contact.name}</span><span>${value}</span></li>`;
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
        
        for (let experience of this.data.experience) {
            this.insert_single_experience(experience);
        }

        // body > main > section.education > ul
        // this.updateContent('body > main > section.experience > ul', html);
    }

    insert_single_experience(experience) {
    
        let html = "";
        let points_html = "";
        for (let point of experience.points) {
            points_html += `<li>${point}</li>`;
        }

        html += `
        <section class="single_experience">
            <h1>${experience.title}</h1>
            <h2>${experience.organisation}</h2>
            <h3>${experience.location}</h3> 
            <h4>${experience.date.from}</span> => <span>${experience.date.to}</span></h4> 
            <ul>
                ${points_html}
            </ul>
        </section>`;

        let section_experience = document.querySelector('body > main > section.experience');
        section_experience.insertAdjacentHTML('beforeend', html);


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

