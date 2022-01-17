const LanguageMenuTemplate = document.createElement("template");
LanguageMenuTemplate.innerHTML = `
    <link href="../../main.css" rel="stylesheet">
    <style>
        .language-menu {
            display: flex;
            flex-direction: column;
            align-content: center;
            justify-content: center;
            align-items: flex-start;
        }
        .language-menu-item {
            align-self: stretch;
            cursor: pointer;
        }
        .language-menu-item.active {
            color: var(--color-light_0055ff-dark_009aff);
        }
        .language-menu-item:hover {
            color: var(--color-light_0055ff-dark_009aff);
        }
        .language-menu-triangle-up {
            align-self: flex-end;
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-bottom: 15px solid var(--color-light_f5f5f5-dark_121212);
            margin-right: 15px;
            z-index: 1;
        }
        .language-menu-item-container {
            align-self: stretch;
            padding: 15px;
            background-color: var(--color-light_f5f5f5-dark_121212);
            color: var(--color-light_f5f5f5-dark_121212-reverse);
            display: flex;
            flex-direction: column;
            align-content: center;
            justify-content: flex-start;
            align-items: flex-start;
            row-gap: 10px;
            max-height: calc(100vh - 60px);
            overflow-y: auto;
        }
    </style>
    <div class="language-menu">
        <div class="language-menu-triangle-up"></div>
        <div class="language-menu-item-container">
        <div
            id="language-en"
            class="language-menu-item"
            value="en"
            onclick="javascript:changeLanguage('navbar_language_menu','en')"
            >
            English
        </div>
        <hr class="dashed-divider" />
        <div
            id="language-hi"
            class="language-menu-item"
            value="hi"
            onclick="javascript:changeLanguage('navbar_language_menu','hi')"
        >
            हिन्दी
        </div>
        <hr class="dashed-divider" />
        <div
            id="language-gu"
            class="language-menu-item"
            value="gu"
            onclick="javascript:changeLanguage('navbar_language_menu','gu')"
        >
            ગુજરાતી
        </div>
        <hr class="dashed-divider" />
        <div
            id="language-sa"
            class="language-menu-item"
            value="sa"
            onclick="javascript:changeLanguage('navbar_language_menu','sa')"
        >
            संस्कृतम्
        </div>
    </div>
`;

class AppLanguageMenu extends HTMLElement {
    constructor() {
        super();
        // element created

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(LanguageMenuTemplate.content.cloneNode(true));
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
        if(name === "language") {
            if(oldValue !== null) {
                this.shadowRoot.querySelector(`#language-${oldValue}`).classList.remove("active");
            }
            this.shadowRoot.querySelector(`#language-${newValue}`).classList.add("active");
        }
    }

    adoptedCallback() {
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
    }

    // there can be other element methods and properties
}

customElements.define("app-language-menu", AppLanguageMenu);
