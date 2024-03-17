class AboutComponent extends HTMLElement {
  constructor(
    basePath = "/portfolio/sections/about",
    templateUrl = "/portfolio/sections/about/about.html",
    templateStyleUrls = [
      "/portfolio/main.css",
      "/portfolio/sections/about/about.css",
      "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css",
    ],
  ) {
    super();

    this.basePath = basePath;
    this.templateUrl = templateUrl;
    this.templateStyleUrls = templateStyleUrls;

    setComponentTemplate.call(
      this,
      () => {
        this.fetchAboutData();
      },
      () => {
        console.log("Initial setup failed!");
      },
    );
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

  async fetchAboutData(language = "en") {
    try {
      const response = await fetch(`${this.basePath}/data/${language}.about.json`);
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
