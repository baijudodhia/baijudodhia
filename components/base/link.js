const LinkTemplate = document.createElement("template");
LinkTemplate.innerHTML = `
		<link href="../../main.css" rel="stylesheet">
		<style>
			.link-container {
				display: inline-block;
				padding: 0px 0px;
				width: fit-content;
				border: 2px solid transparent;
				transition: 0.2s linear;
				text-decoration: none!important;
			}
			.link-container > * {
				color: var(--color-primary);
				font-weight: var(--font-weight);
			}
			.link-container.background {
				border-radius: 7px;
			}
			.link-container.background:hover > * {
				color: var(--color-secondary);
				font-weight: var(--font-weight);
			}
			.link-container.background:hover {
				background-color: var(--color-tertiary);
				padding: 0px 8px;
			}
			.link-container.underline {
				border-radius: 0px;
			}
			.link-container.underline:hover {
				border-radius: 0px;
				border-bottom: 2px dashed var(--color-bw_secondary_invert);
			}
			.link-container.underline:hover > * {
				color: var(--color-bw_secondary_invert);
			}
			.link-container:focus,
			.link-container:focus-visible {
				outline: none;
				padding: 0px 8px;
				border: 1px dashed var(--color-primary);
			}
			.link-container:active {
				transform: scale(0.95);
			}
			.link {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				align-content: center;
				column-gap: 6px;
				padding: 0px 0px;
				width: fit-content;
				text-decoration: none!important;
			}
			.link-icon {
				width:20px;
			}
		</style>
		<div class="link-container" part="link_container">
			<a href="" class="link" target="_blank" rel="noopener" part="link">
				<div class="link-title" part="link_title"></div>
			</a>
		</div>
`;

class AppLink extends HTMLElement {
	constructor() {
		super();
		// element created

		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(LinkTemplate.content.cloneNode(true));
	}

	connectedCallback() {
		// browser calls this method when the element is added to the document
		// (can be called many times if an element is repeatedly added/removed)
		const _app_link_container = this.shadowRoot.querySelector(".link-container");

		const _app_link = this.shadowRoot.querySelector(".link");
		_app_link.setAttribute("href", this.getAttribute("link"));

		if (this.getAttribute("icon") !== null) {
			const link = document.createElement("link");
			link.setAttribute("href", "../../assets/icons/all.css");
			link.setAttribute("rel", "stylesheet");
			this.shadowRoot.prepend(link);

			const icon = document.createElement("i");
			icon.setAttribute("aria-hidden", "true");
			icon.setAttribute("part", "link-icon");
			icon.setAttribute("class", this.getAttribute("icon"));
			icon.setAttribute("title", this.getAttribute("icon-title"));
			if (this.getAttribute("icon-direction") === "right") {
				_app_link.appendChild(icon);
			} else {
				_app_link.prepend(icon);
			}
		}

		if (this.getAttribute("hover-effect") === "underline") {
			_app_link_container.classList.add("underline");
		} else {
			_app_link_container.classList.add("background");
		}

		const _app_linkTitle = this.shadowRoot.querySelector(".link-title");
		_app_linkTitle.innerText = this.getAttribute("title");
	}

	disconnectedCallback() {
		// browser calls this method when the element is removed from the document
		// (can be called many times if an element is repeatedly added/removed)
	}

	static get observedAttributes() {
		return ["icon", "title", "link"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		// called when one of attributes listed above is modified
		if (name === "title" && oldValue !== newValue) {
			this.shadowRoot.querySelector(".link-title").innerText = `${newValue}`;
		}
		if (name === "link" && oldValue !== newValue) {
			this.shadowRoot.querySelector(".link").href = `${newValue}`;
		}
	}

	adoptedCallback() {
		// called when the element is moved to a new document
		// (happens in document.adoptNode, very rarely used)
	}

	// there can be other element methods and properties
}

customElements.define("app-link", AppLink);
