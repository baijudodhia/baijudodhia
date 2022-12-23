const ProjectsTemplate = document.createElement("template");
ProjectsTemplate.innerHTML = `
    <link href='../../main.css' rel='stylesheet'>
    <style>
        #projects {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;
            align-content: center;
            row-gap: 30px;
        }
        .projects-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            align-content: center;
            flex-direction: row;
            column-gap: 20px;
        }
        #projects-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(2, 1fr);
            grid-row-gap: 30px;
            grid-column-gap: 30px;
        }
        @media only screen and (max-width: 950px) {
            #projects-container {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(3, 1fr);
                grid-row-gap: 20px;
                grid-column-gap: 20px;
            }
        }
        @media only screen and (max-width: 650px) {
            #projects-container {
                display: grid;
                grid-template-columns: repeat(1, 1fr);
                grid-template-rows: repeat(6, 1fr);
                grid-row-gap: 20px;
                grid-column-gap: 20px;
            }
        }
        .project-item {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;
            align-content: space-between;
            row-gap: 15px;
            padding: 20px;
            transition: 0.05s linear;
            border: 1.5px solid var(--color-primary);
            // border-image: var(--gradient-primary) 30;
            // background-image: none;
            // background-clip: content-box, border-box;
            // background-origin: border-box;
            border-radius: 1rem;
            box-shadow: 0px 0px 10px -4px var(--color-secondary);
        }
        .project-item:hover {
            font-weight: var(--font-weight-hover);
            color: var(--color-bw_secondary);
            border: 1.5px solid var(--color-primary);
            // border-image: var(--gradient-primary) 30;
            // background-image: var(--gradient-primary);
            background-color: var(--color-primary);
            // background-clip: border-box;
            // background-origin: border-box;
            box-shadow: 0px 0px 10px -4px var(--color-secondary);
        }
        .project-item:hover .project-divider {
            border-top: 1.5px dashed var(--color-bw_secondary);
        }
        .project-item:hover app-link::part(link) {
            font-weight: var(--font-weight-hover);
            color: var(--color-bw_secondary);
        }
        .project-item:hover app-link::part(link_container):hover {
            border-bottom: 1.5px dashed var(--color-bw_secondary);
        }
        .project-divider {
            align-self: stretch;
            margin: 0px;
            border: none;
            border-top: 1.5px dashed var(--color-bw_secondary_invert);
            height: 0px;
            background-color: transparent;
        }
        .project-links {
            flex-grow: 1;
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
            align-content: center;
            column-gap: 20px;
        }
    </style>
    <div id="projects">
        <div class="projects-header">
        <h3>Projects</h3>
        <app-link
            title="view all"
            link="https://github.com/baijudodhia?tab=repositories"
        ></app-link>
        </div>
    </div>
    <template id="projects-template">
        <div class="project-item">
            <div class="project-title"></div>
            <hr class="project-divider" />
            <div class="project-description"></div>
            <div class="project-links">
                <app-link
                    class="app-link-code"
                    icon="fa fa-code"
                    icon-title="Check out code on GitHub"
                    title="code"
                    link=""
                    hover-effect="underline"
                ></app-link>
                <app-link
                    class="app-link-live"
                    icon="fa fa-external-link-square"
                    icon-direction="right"
                    icon-title="Check out the live demo"
                    title="live"
                    link=""
                    hover-effect="underline"
                ></app-link>
            </div>
        </div>
    </template>
`;

class AppProjects extends HTMLElement {
    constructor() {
        super();
        // element created
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(ProjectsTemplate.content.cloneNode(true));
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
            this.addSectionLoader();
            this.fetchProjectsData(newValue);
        }
    }

    adoptedCallback() {
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
    }

    // there can be other element methods and properties
    async fetchProjectsData(language = "en") {
        const response = await fetch(`/data/projects/${language}.projects.json`);
        const data = await response.json();
        this.loadProjects(data["projects"]);
    }

    loadProjects(data) {
        if ("content" in document.createElement("template")) {
            let projectsContainer = document.createElement("div");
            projectsContainer.setAttribute("id", "projects-container");
            projectsContainer.innerHTML = "";
            let projectsTemplate = this.shadowRoot.querySelector("#projects-template");
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    const val = data[key];
                    var clone = projectsTemplate.content.cloneNode(true);
                    clone.querySelector(".project-title").innerText = val["title"];
                    clone.querySelector(".project-description").innerText = val["description"];
                    if (val["code"]["linkExists"] === true) {
                        clone.querySelector(".app-link-code").setAttribute("link", val["code"]["codeLink"]);
                    } else {
                        clone.querySelector(".app-link-code").remove();
                    }
                    if (val.hosted.linkExists) {
                        clone.querySelector(".app-link-live").setAttribute("link", val["hosted"]["hostedLink"]);
                    } else {
                        clone.querySelector(".app-link-live").remove();
                    }
                    projectsContainer.appendChild(clone);
                }
            }
            this.removeSectionLoader();
            this.shadowRoot.querySelector("#projects").append(projectsContainer);
        }
    }

    addSectionLoader() {
        // Section Loader
        const sectionLoader = document.createElement("div");
        sectionLoader.setAttribute("class", "section-loader");

        const onlineCertificates = this.shadowRoot.querySelector("#projects");
        onlineCertificates.append(sectionLoader);
    }

    removeSectionLoader() {
        this.shadowRoot.querySelector(".section-loader").remove();
    }
}

customElements.define("app-projects", AppProjects);
