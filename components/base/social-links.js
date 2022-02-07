const SocialLinksTemplate = document.createElement("template");
SocialLinksTemplate.innerHTML = `
    <link href="../../main.css" rel="stylesheet">
    <style>
        .social-links {
            display: flex;
            flex-direction: row;
            align-content: center;
            align-items: center;
            column-gap: 10px;
        }
    </style>
    <div class="social-links"></div>
`;

class AppSocialLinks extends HTMLElement {
	constructor() {
		super();
		// element created

		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(SocialLinksTemplate.content.cloneNode(true));

		const _app_link = document.createElement("app-link");

		const _app_link_github = _app_link.cloneNode(true);
		_app_link_github.setAttribute("icon", "fa fa-github-square");
		_app_link_github.setAttribute("icon-title", "Check out projects on GitHub");
		_app_link_github.setAttribute("title", "GitHub");
		_app_link_github.setAttribute("link", "https://github.com/baijudodhia");

		const _app_link_linkedin = _app_link.cloneNode(true);
		_app_link_linkedin.setAttribute("icon", "fa fa-linkedin-square");
		_app_link_linkedin.setAttribute("icon-title", "Connect with me on LinkedIn");
		_app_link_linkedin.setAttribute("title", "LinkedIn");
		_app_link_linkedin.setAttribute("link", "https://www.linkedin.com/in/baijudodhia");

		const _social_links = this.shadowRoot.querySelector(".social-links");
		_social_links.append(_app_link_github);
		_social_links.append(_app_link_linkedin);
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
		return [""];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		// called when one of attributes listed above is modified
	}

	adoptedCallback() {
		// called when the element is moved to a new document
		// (happens in document.adoptNode, very rarely used)
	}

	// there can be other element methods and properties
}

customElements.define("app-social-links", AppSocialLinks);
