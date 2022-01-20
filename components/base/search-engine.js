const SearchEngineTemplate = document.createElement('template');
SearchEngineTemplate.innerHTML = `
    <link href="../../main.css" rel="stylesheet">
    <link href="../../assets/icons/all.css" rel="stylesheet">
    <style>
        .search-engine-button {
            color: var(--color-light_0055ff-dark_009aff);
        }
    </style>
    <span class="search-engine-container">
        <i class="fa fa-search search-engine-button" aria-hidden="true"></i>
        <app-search-engine-menu class="search-engine-menu"></app-search-engine-menu>
    </span>
`;

class AppSearchEngine extends HTMLElement {
    constructor() {
        super();
        // element created
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(SearchEngineTemplate.content.cloneNode(true));
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
            "language"
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // called when one of attributes listed above is modified
        if (name === "language") {
            this.shadowRoot.querySelector("app-language-menu").setAttribute("language", newValue);
        }
    }

    adoptedCallback() {
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
    }

    // there can be other element methods and properties
}

customElements.define('app-search-engine', AppSearchEngine);