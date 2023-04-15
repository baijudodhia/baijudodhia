const LanguageChangerTemplate = document.createElement("template");
LanguageChangerTemplate.innerHTML = `
    <link href="./portfolio/main.css" rel="stylesheet">
    <link href="https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css" rel="stylesheet">
    <style></style>
    <div class="language-container">
        <button type="button" class="language-button">
            <i class="fa fa-language" aria-hidden="true"></i>
        </button>
        <app-language-menu class="language-menu"></app-language-menu>
    </div>s
`;

class AppLanguageChanger extends HTMLElement {
	constructor() {
		super();
		// element created
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(LanguageChangerTemplate.content.cloneNode(true));
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

customElements.define("app-language-changer", AppLanguageChanger);
