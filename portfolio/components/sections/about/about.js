class AboutComponent extends HTMLElement {
  constructor(
    templateUrl = "portfolio/components/sections/about/about.html",
    templateStyleUrls = [
      "portfolio/main.css",
      "portfolio/components/sections/about/about.css",
      "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css",
    ],
  ) {
    super();

    this.templateUrl = templateUrl;
    this.templateStyleUrls = templateStyleUrls;

    this.setupTemplateUrl();
  }

  /**
   * 1. Browser calls this method when the element is added to the document.
   * 2. Can be called many times if an element is repeatedly added/removed.
   */
  connectedCallback() {}

  /**
   * 1. Browser calls this method when the element is removed from the document.
   * 2. Can be called many times if an element is repeatedly added/removed.
   */
  disconnectedCallback() {}

  static get observedAttributes() {
    return ["language"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "language" && oldValue !== newValue && newValue) {
      this.fetchAboutData(newValue);
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  async setupTemplateUrl() {
    this.template = document.createElement("template");

    try {
      const response = await fetch(this.templateUrl);
      const html = await response.text();
      this.template.innerHTML = html;

      this.setupShadowDOM();
    } catch (error) {
      console.error("Error fetching or setting up template:", error);
    }
  }

  setupShadowDOM() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));

    this.setupTemplateStyleUrls();
  }

  setupTemplateStyleUrls() {
    this.templateStyleUrls.forEach((style) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = style;
      this.shadowRoot.appendChild(link);
    });
  }

  async fetchAboutData(language = "en") {
    try {
      const response = await fetch(`./portfolio/data/about/${language}.about.json`);
      const data = await response.json();
      const aboutName = this.shadowRoot.querySelector(".about-name");

      if (aboutName) {
        aboutName.setAttribute("title", data["name"]);
        aboutName.innerHTML = data["name"];
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
    }
  }
}

customElements.define("app-about", AboutComponent);
