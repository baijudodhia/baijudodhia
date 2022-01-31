const WorkExperienceTemplate = document.createElement('template');
WorkExperienceTemplate.innerHTML = `
    <link href='../../main.css' rel='stylesheet'>
    <style>
        #work-experience {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;
            align-content: center;
            row-gap: 15px;
        }
        #work-experience-container {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;
            align-content: center;
            row-gap: 15px;
        }
        .work-experience-item {
            display: flex;
            flex-direction: column;
            align-content: center;
            justify-content: center;
            align-items: flex-start;
            row-gap: 15px;
            border: 1.5px solid var(--color-light_0055ff-dark_009aff);
            background-color: var(--color-light_f5f5f5-dark_121212);
            border-radius: 10px;
            padding: 15px;
            transition: 0.2s linear;
            box-shadow: 0px 0px 10px -4px var(--color-light_0055ff-dark_009aff);
        }
        .work-experience-item:hover {
            font-weight: var(--font-weight-hover);
            color: var(--color-light_f5f5f5-dark_121212);
            background-color: var(--color-light_0055ff-dark_009aff);
            box-shadow: 0px 0px 10px -4px var(--color-light_121212-dark_000000);
        }
        .work-experience-item:hover .work-experience-divider {
            border-top: 1.5px dashed var(--color-light_f5f5f5-dark_121212);
        }
        .work-experience-item:hover app-label-with-icon::part(lwi_label) {
            font-weight: var(--font-weight-hover);
            color: var(--color-light_f5f5f5-dark_121212);
        }
        .work-experience-header {
            align-self: stretch;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            align-content: center;
            column-gap: 30px;
        }
        @media only screen and (max-width: 931px) {
            .work-experience-header {
                align-self: stretch;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-content: center;
                align-items: center;
                row-gap: 15px;
            }
        }
        .work-experience-organisation-logo-container {
            flex-grow: 1;
            display: flex;
            align-self: stretch;
            justify-content: center;
            align-content: center;
            flex-direction: row;
            width: 180px;
            background-color: #f5f5f5;
            border-radius: 5px;
            padding: 15px;
            box-shadow: 0px 0px 10px -3px var(--color-light_ffffff-dark_00000);
        }
        @media only screen and (max-width: 931px) {
            .work-experience-organisation-logo-container {
                width: unset;
                align-self: stretch;
                height: 100px;
                padding: 15px;
            }
        }
        .work-experience-organisation-logo {
            width: 100%;
            height: 100%;
        }
        .work-experience-details {
            align-self: stretch;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(3, 1fr);
            grid-row-gap: 5px;
            grid-column-gap: 15px;
        }
        @media only screen and (max-width: 650px) {
            .work-experience-details {
                align-self: stretch;
                display: grid;
                grid-template-columns: repeat(1, 1fr);
                grid-template-rows: repeat(6, 1fr);
                grid-row-gap: 5px;
                grid-column-gap: 15px;
            }
        }
        .work-experience-details app-label-with-icon::part(lwi) {
            min-width: 300px;
        }
        @media only screen and (max-width: 781px) {
            .work-experience-details app-label-with-icon::part(lwi) {
                min-width: fit-content;
            }
        }
        .work-experience-divider {
            align-self: stretch;
            margin: 0px;
            border: none;
            border-top: 1.5px dashed var(--color-light_f5f5f5-dark_121212-reverse);
            height: 0px;
            background-color: transparent;
        }
        .work-experience-item details {
            align-self: stretch;
            cursor: pointer;
        }
        .work-experience-item details[open] {
            align-self: flex-start;
            cursor: pointer;
        }
        .work-experience-item details > summary,
        .work-experience-item details > summary::-webkit-details-marker {
            display: block;
        }
        .work-experience-item details > summary > .summary-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            align-content: center;
        }
        .work-experience-item details .summary-header-arrow-down {
            display: block;
        }
        .work-experience-item details[open] .summary-header-arrow-down {
            display: none;
        }
        .work-experience-item details .summary-header-arrow-up {
            display: none;
        }
        .work-experience-item details[open] .summary-header-arrow-up {
            display: block;
        }
        .work-experience-description {
            padding-top: 10px;
        }
        .work-experience-description > * {
            margin: 0px;
        }
    </style>
    <div id="work-experience">
        <h3>Work Experience</h3>
    </div>
    <template id="work-experience-template">
        <div class="work-experience-item">
            <div class="work-experience-header">
                <div class="work-experience-organisation-logo-container">
                    <img class="work-experience-organisation-logo" src="" alt="" />
                </div>
                <div class="work-experience-details">
                    <app-label-with-icon
                        class="work-experience-profile"
                        icon="fa fa-briefcase"
                        icon_title="Work Profile"
                        label=""
                    ></app-label-with-icon>
                    <app-label-with-icon
                        class="work-experience-date"
                        icon="fa fa-calendar-check-o"
                        icon_title="Work Duration"
                        label=""
                    ></app-label-with-icon>
                    <app-label-with-icon
                        class="work-experience-organisation"
                        icon="fa fa-building-o"
                        icon_title="Work Organisation"
                        label=""
                    ></app-label-with-icon>
                    <app-label-with-icon
                        class="work-experience-location"
                        icon="fa fa-map-marker"
                        icon_title="Work Location"
                        label=""
                    ></app-label-with-icon>
                    <app-label-with-icon
                        class="work-experience-type"
                        icon="fa fa-tasks"
                        icon_title="Work Type"
                        label=""
                    ></app-label-with-icon>
                    <app-label-with-icon
                        class="work-experience-industry"
                        icon="fa fa-industry"
                        icon_title="Work Industry"
                        label=""
                    ></app-label-with-icon>
                </div>
            </div>
            <div class="work-experience-divider"></div>
            <details>
                <summary>
                    <div class="summary-header">
                        <div class="summary-header-title">Description</div>
                        <div class="summary-header-arrow-down">
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="summary-header-arrow-up">
                            <i class="fas fa-chevron-up"></i>
                        </div>
                    </div>
                </summary>
                <div class="work-experience-description"></div>
            </details>
        </div>
    </template>
`;

class AppWorkExperience extends HTMLElement {
    constructor() {
        super();
        // element created
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(WorkExperienceTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        // browser calls this method when the element is added to the document
        // (can be called many times if an element is repeatedly added/removed)
        const link = document.createElement("link");
        link.setAttribute("href", "../../assets/icons/all.css");
        link.setAttribute("rel", "stylesheet");
        this.shadowRoot.prepend(link);
    }

    disconnectedCallback() {
        // browser calls this method when the element is removed from the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    static get observedAttributes() {
        return [
            "language"
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // called when one of attributes listed above is modified
        if (name === "language" && oldValue !== newValue && newValue !== null && newValue !== undefined && newValue !== "") {
            this.addSectionLoader();
            this.fetchWorkExperienceData(newValue);
        };
    }

    adoptedCallback() {
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
    }

    // there can be other element methods and properties
    async fetchWorkExperienceData(language = "en") {
        const response = await fetch(`/data/work-experience/${language}.work-experience.json`);
        const data = await response.json();
        this.loadWorkExperience(data['workExperience']);
    }

    loadWorkExperience(data) {
        if ('content' in document.createElement('template')) {
            let workExperienceContainer = document.createElement('div');
            workExperienceContainer.setAttribute('id', 'work-experience-container');
            workExperienceContainer.innerHTML = '';
            let workExperienceTemplate = this.shadowRoot.querySelector('#work-experience-template');
            let firstItemOpenFlag = true;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    const val = data[key];
                    var clone = workExperienceTemplate.content.cloneNode(true);
                    clone.querySelector(".work-experience-organisation-logo").setAttribute("src", val['organisationLogo']);
                    clone.querySelector(".work-experience-organisation-logo").setAttribute("alt", val['organisationName']);
                    clone.querySelector(".work-experience-profile").setAttribute('label', val['profileTitle']);
                    clone.querySelector(".work-experience-date").setAttribute('label', val['fromDate'] + " - " + val["toDate"]);
                    clone.querySelector(".work-experience-organisation").setAttribute('label', val['organisationName']);
                    clone.querySelector(".work-experience-location").setAttribute('label', val['workLocation']);
                    clone.querySelector(".work-experience-type").setAttribute('label', val['workType']);
                    clone.querySelector(".work-experience-industry").setAttribute('label', val['workIndustry']);
                    clone.querySelector(".work-experience-description").innerHTML = val['workDescription'];
                    if(firstItemOpenFlag) {
                        clone.querySelector("details").setAttribute('open','');
                        firstItemOpenFlag = false;
                    }
                    workExperienceContainer.appendChild(clone);
                }
            }
            this.removeSectionLoader();
            this.shadowRoot.querySelector('#work-experience').append(workExperienceContainer);
        }
    }

    addSectionLoader() {
        // Section Loader
        const sectionLoader = document.createElement('div');
        sectionLoader.setAttribute('class', 'section-loader');

        const workExperience = this.shadowRoot.querySelector('#work-experience');
        workExperience.append(sectionLoader);
    }

    removeSectionLoader() {
        this.shadowRoot.querySelector('.section-loader').remove();
    }
}

customElements.define('app-work-experience', AppWorkExperience);