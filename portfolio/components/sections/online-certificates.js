const OnlineCertificatesTemplate = document.createElement("template");
OnlineCertificatesTemplate.innerHTML = `
    <link href='./portfolio/main.css' rel='stylesheet'>
    <style>
        #online-certificates {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;
            align-content: center;
            row-gap: 30px;
        }
        .online-certificates-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            align-content: center;
            flex-direction: row;
            column-gap: 20px;
        }
        #online-certificates-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(auto-fit, 1fr);
            grid-row-gap: 30px;
            grid-column-gap: 30px;
        }
        @media only screen and (max-width: 720px) {
            #online-certificates-container {
                display: grid;
                grid-template-columns: repeat(1, 1fr);
                grid-template-rows: repeat(auto-fit, 1fr);
                grid-row-gap: 20px;
                grid-column-gap: 20px;
            }
        }
        .online-certificates-item {
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
        .online-certificates-item:hover {
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
        .online-certificates-item:hover .online-certificates-divider {
            border-top: 1.5px dashed var(--color-bw_secondary);
        }
        .online-certificates-item:hover app-label-with-icon::part(lwi_icon) {
            font-weight: var(--font-weight-hover);
            color: var(--color-bw_secondary);
        }
        .online-certificates-item:hover app-label-with-icon::part(lwi_label) {
            font-weight: var(--font-weight-hover);
            color: var(--color-bw_secondary);
        }
        .online-certificates-item:hover app-link::part(link_container) {
            border-radius: 5px;
        }
        .online-certificates-item:hover app-link::part(link_container):hover {
            border-radius: 5px;
            background-color: var(--color-bw_secondary);
            box-shadow: 0px 0px 10px -4px var(--color-secondary);
        }
        .online-certificates-item:hover app-link::part(link) {
            font-weight: var(--font-weight-hover);
            color: var(--color-bw_secondary_invert);
        }
        .online-certificates-divider {
            align-self: stretch;
            margin: 0px;
            border: none;
            border-top: 1.5px dashed var(--color-bw_secondary_invert);
            height: 0px;
            background-color: transparent;
        }
        .online-certificates-details {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            align-content: center;
            row-gap: 15px;
        }
        .online-certificates-link-container {
            display: flex;
            flex-direction: row;
            align-content: center;
            justify-content: center;
            align-items: center;
            column-gap: 8px;
        }
        .online-certificates-link-container .fa-certificate {
            width: 20px;
            text-align: center;
        }
    </style>
    <div id="online-certificates">
        <div class="online-certificates-header">
            <h3>Online Certifications</h3>
        </div>
    </div>
    <template id="online-certificates-template">
        <div class="online-certificates-item">
            <div class="online-certificates-title"></div>
            <hr class="online-certificates-divider" />
            <div class="online-certificates-details">
                <app-label-with-icon
                    class="online-certificates-organisation"
                    icon="fa fa-building-o"
                    icon_title="Course Organisation"
                    label="University of Michigen"
                ></app-label-with-icon>
                <app-label-with-icon
                    class="online-certificates-date"
                    icon="fa fa-calendar-check-o"
                    icon_title="Certificate Issue Date"
                    label="Sept 2020"
                ></app-label-with-icon>
                <div class="online-certificates-link-container">
                    <i class="fa fa-certificate" aria-hidden="true"></i>
                    <app-link
                        class="online-certificates-link"
                        icon="fa fa-external-link-square"
                        icon-direction="right"
                        icon-title="Course Completion Certificate"
                        title="Certificate"
                        link=""
                    ></app-link>
                </div>
            </div>
        </div>
    </template>
`;

class AppOnlineCertificates extends HTMLElement {
    constructor() {
        super();
        // element created
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(OnlineCertificatesTemplate.content.cloneNode(true));
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
            this.fetchOnlineCertificatesData(newValue);
        }
    }

    adoptedCallback() {
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
    }

    // there can be other element methods and properties
    async fetchOnlineCertificatesData(language = "en") {
        const response = await fetch(`./portfolio/data/online-certificates/${language}.online-certificates.json`);
        const data = await response.json();
        this.loadOnlineCertifications(data["certificates"]);
    }

    loadOnlineCertifications(data) {
        if ("content" in document.createElement("template")) {
            let onlineCertificatesContainer = document.createElement("div");
            onlineCertificatesContainer.setAttribute("id", "online-certificates-container");
            onlineCertificatesContainer.innerHTML = "";
            let onlineCertificatesTemplate = this.shadowRoot.querySelector("#online-certificates-template");
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    const val = data[key];
                    var clone = onlineCertificatesTemplate.content.cloneNode(true);
                    clone.querySelector(".online-certificates-title").innerText = val["title"];
                    clone.querySelector(".online-certificates-organisation").setAttribute("label", val["organisation"]);
                    clone.querySelector(".online-certificates-date").setAttribute("label", val["completionDate"]);
                    clone.querySelector(".online-certificates-link").setAttribute("link", val["certificateLink"]);
                    onlineCertificatesContainer.appendChild(clone);
                }
            }
            this.removeSectionLoader();
            this.shadowRoot.querySelector("#online-certificates").append(onlineCertificatesContainer);
        }
    }

    addSectionLoader() {
        const sectionLoader = document.createElement("div");
        sectionLoader.setAttribute("class", "section-loader");

        const onlineCertificates = this.shadowRoot.querySelector("#online-certificates");
        onlineCertificates.append(sectionLoader);
    }

    removeSectionLoader() {
        this.shadowRoot.querySelector(".section-loader").remove();
    }
}

customElements.define("app-online-certificates", AppOnlineCertificates);
