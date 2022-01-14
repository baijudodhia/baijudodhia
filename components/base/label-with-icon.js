const LabelWithIconTemplate = document.createElement("template");
LabelWithIconTemplate.innerHTML = `
    <link href="../../main.css" rel="stylesheet">
    <style>
    .lwi-container {
        display: inline-block;
        width: fit-content;
    }
    .lwi {
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: flex-start;
        align-items: center;
        column-gap: 10px;
    }
    .lwi > * {
        color: var(--color-light_121212-dark_f5f5f5);
        font-weight: var(--font-weight);
    }
    .lwi-icon {
        width: 20px;
        text-align: center;
    }
    </style>
    <div class="lwi-container" part="lwi_container">
        <div class="lwi" part="lwi">
            <i aria-hidden="true" class="lwi-icon" part="lwi_icon"></i>
            <div class="lwi-label" part="lwi_label"></div>
        </div>
    </div>
`;

class AppLabelWithIcon extends HTMLElement {
    constructor() {
        super();
        // element created

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(LabelWithIconTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        // browser calls this method when the element is added to the document
        // (can be called many times if an element is repeatedly added/removed)
        const _app_lwi_container = this.shadowRoot.querySelector(".lwi-container");

        const link = document.createElement("link");
        link.setAttribute("href", "../../assets/icons/all.css");
        link.setAttribute("rel", "stylesheet");
        this.shadowRoot.prepend(link);

        const _api_lwi_icon = this.shadowRoot.querySelector(".lwi-icon");
        const _api_lwi_icon_classList = this.getAttribute('icon').split(' ');
        _api_lwi_icon_classList.forEach(e => {
            _api_lwi_icon.classList.add(e);
        });
        if (this.hasAttribute('icon_title')) {
            _api_lwi_icon.setAttribute('title', this.getAttribute('icon_title'));
        }

        const _app_lwi_label = this.shadowRoot.querySelector(".lwi-label");
        _app_lwi_label.innerText = this.getAttribute("label");
    }

    disconnectedCallback() {
        // browser calls this method when the element is removed from the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    static get observedAttributes() {
        return ["icon", "label"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // called when one of attributes listed above is modified
        if (name === "icon" && oldValue !== newValue) {
            if (oldValue !== null && oldValue !== undefined && oldValue !== "") {
                const old_value_class_list = oldValue.split(' ');
                old_value_class_list.forEach(e => {
                    if (this.shadowRoot.querySelector(".lwi-icon").classList.contains(e)) {
                        this.shadowRoot.querySelector(".lwi-icon").classList.remove(e);
                    }
                });
            }
            const new_value_class_list = newValue.split(' ');
            new_value_class_list.forEach(e => {
                this.shadowRoot.querySelector(".lwi-icon").classList.add(e);
            });
        }
        if (name === "label" && oldValue !== newValue) {
            this.shadowRoot.querySelector(".lwi-label").innerText = `${newValue}`;
        }
    }

    adoptedCallback() {
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
    }

    // there can be other element methods and properties
}

customElements.define("app-label-with-icon", AppLabelWithIcon);
