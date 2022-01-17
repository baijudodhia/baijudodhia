const ThemeChangerTemplate = document.createElement('template');
ThemeChangerTemplate.innerHTML = `
    <link href="../../main.css" rel="stylesheet">
    <style></style>
    <input
        type="submit"
        name="theme"
        id="theme-changer"
        value="🌕"
        theme="dark"
        onclick="changeTheme();"
    />
`;

class AppThemeChanger extends HTMLElement {
    constructor() {
        super();
        // element created
        this.attachShadow({ mode: 'open' });
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
        if(name === "value" && oldValue !== null) {
            this.shadowRoot.querySelector("#theme-changer").setAttribute("value", newValue);
        }
        if(name === "theme" && oldValue !== null) {
            this.shadowRoot.querySelector("#theme-changer").setAttribute("theme", newValue);
        }
    }

    adoptedCallback() {
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
    }

    // there can be other element methods and properties
}

customElements.define('app-theme-changer', AppThemeChanger);