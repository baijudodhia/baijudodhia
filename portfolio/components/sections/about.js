const AboutTemplate = document.createElement("template");
AboutTemplate.innerHTML = `
    <link href='./portfolio/main.css' rel='stylesheet'>
    <style>
        #about {
            display: flex;
            flex-direction: column;
            align-content: center;
            justify-content: center;
            align-items: flex-start;
            row-gap: 20px;
        }
        #about > h1,
        #about > h2 {
            margin: 0px;
        }
        #about > h1 * {
            font-size: 28px !important;
        }
        #about > h1 app-link::part(link_title) {
            font-size: 28px !important;
        }
        .about-name-container {
            display: inline-flex;
            align-items: center;
            column-gap: 10px;
        }
    </style>
    <div id="about">
        <h1>
            <div class="about-name-container">
                <div class="about-name" title="Baiju Dodhia">Baiju Dodhia</div>
                <app-search-engine></app-search-engine>
            </div>
        </h1>
        <div>
            Software Engineer with entrepreneurial mindset having strong project-based knowledge of various technical skills including programming languages and software tools.
        </div>
        <div class="about-profile">
            Currently working as Associate Frontend Engineer at
            <app-link
                title="Think360"
                link="https://www.think360.ai/"
            ></app-link>
        </div>
        <app-social-links></app-social-links>
        <!-- What I Do ? -->
        <app-what-i-do></app-what-i-do>
    </div>
`;

class AppAbout extends HTMLElement {
    constructor() {
        super();
        // element created
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(AboutTemplate.content.cloneNode(true));

        const link = document.createElement("link");
        link.setAttribute("href", "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css");
        link.setAttribute("rel", "stylesheet");
        this.shadowRoot.prepend(link);
    }

    connectedCallback() {
        // browser calls this method when the element is added to the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    disconnectedCallback() {
        // browser calls this method when the element is removed from the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    static get observedAttributes() {
        return ["language"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // called when one of attributes listed above is modified
        if (name === "language" && oldValue !== newValue && newValue !== null && newValue !== undefined && newValue !== "") {
            this.fetchAboutData(newValue);
        }
    }

    adoptedCallback() {
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
    }

    // there can be other element methods and properties
    async fetchAboutData(language = "en") {
        const response = await fetch(`./portfolio/data/about/${language}.about.json`);
        const data = await response.json();
        this.shadowRoot.querySelector(".about-name").setAttribute("title", data["name"]);
        this.shadowRoot.querySelector(".about-name").innerHTML = data["name"];
    }
}

customElements.define("app-about", AppAbout);
