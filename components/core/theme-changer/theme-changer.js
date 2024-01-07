const ThemeChangerTemplate = document.createElement("template");
ThemeChangerTemplate.innerHTML = `
    <link href="./portfolio/main.css" rel="stylesheet">
    <style>
        #theme-changer-container {
            display: flex;
            flex-direction: row;
            align-content: center;
            justify-content: center;
            align-items: center;
            padding: 0px 12.5px;
        }
        .theme-changer-switch {
            position: relative;
            display: inline-block;
            width: 25px;
            height: 15px;
        }
        #theme-changer {
            height: 0;
            opacity: 0;
            overflow: visible;
            padding: 0;
            margin: 0;
            width: 0;
        }
        .theme-changer-slider {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            cursor: pointer;
            background-color: #ccc;
            border-radius: 20px;
            transition: 0s;
        }
        .theme-changer-slider:before {
            content: "";
            position: absolute;
            left: 0%;
            bottom: -5px;
            height: 1.5rem;
            width: 1.5rem;
            transform: translateX(-50%);
            transition: 0.25s cubic-bezier(0.65, 0.05, 0.36, 1);
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-size: 70% !important;
            background: #fff url("https://baijudodhia.github.io/portfolio/assets/images/theme-changer/light.png");
            border-radius: 50%;
            box-shadow: 0px 0px 10px -4px #121212;
        }
        #theme-changer:checked + .theme-changer-slider {
            transition: 0.25s linear;
            background-color: var(--color-primary);
        }
        #theme-changer:checked + .theme-changer-slider:before {
            left: 100%;
            transition: 0.25s cubic-bezier(0.65, 0.05, 0.36, 1);
            background-size: 65% !important;
            transform: translateX(-50%);
            background: #fff url("https://baijudodhia.github.io/portfolio/assets/images/theme-changer/dark.png");
            box-shadow: 0px 0px 10px -4px #f5f5f5;
        }
    </style>
    <div id="theme-changer-container">
        <label class="theme-changer-switch">
            <input
                id="theme-changer"
                name="theme"
                onchange="changeTheme();"
                type="checkbox"
            />
            <span class="theme-changer-slider"></span>
        </label>
    </div>
`;

class AppThemeChanger extends HTMLElement {
    constructor() {
        super();
        // element created
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(ThemeChangerTemplate.content.cloneNode(true));
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
        return [
            /* Attributes to observe. */
            "value",
            "theme"
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // called when one of attributes listed above is modified
        if (name === "value" && oldValue !== null) {
            this.shadowRoot.querySelector("#theme-changer").setAttribute("value", newValue);
        }
        if (name === "theme" && oldValue !== null) {
            let themeChangerChecked = newValue === "dark" ? true : false;
            this.shadowRoot.querySelector("#theme-changer").checked = themeChangerChecked;
            this.shadowRoot.querySelector("#theme-changer").setAttribute("theme", newValue);
        }
    }

    adoptedCallback() {
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
    }

    // there can be other element methods and properties
}

customElements.define("app-theme-changer", AppThemeChanger);
