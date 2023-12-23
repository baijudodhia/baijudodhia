class CertificationComponent extends HTMLElement {
  constructor(
    basePath = "/portfolio/sections/certifications",
    templateUrl = "/portfolio/sections/certifications/certifications.html",
    templateStyleUrls = [
      "/portfolio/main.css",
      "/portfolio/sections/certifications/certifications.css",
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
        this.fetchCertificationsData();
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
      this.fetchCertificationsData(newValue);
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  // there can be other element methods and properties
  async fetchCertificationsData(language = "en") {
    this.addSectionLoader();

    const response = await fetch(`${this.basePath}/data/${language}.certifications.json`);
    const data = await response.json();

    this.loadCertifications(data["certificates"]);
  }

  loadCertifications(data) {
    if ("content" in document.createElement("template")) {
      // Remove the existing container if it exists
      const existingContainer = this.shadowRoot.querySelector("#certifications-container");
      if (existingContainer) {
        existingContainer.remove();
      }

      let certificationsContainer = document.createElement("div");
      certificationsContainer.setAttribute("id", "certifications-container");

      let certificationsTemplate = this.shadowRoot.querySelector("#certifications-template");

      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          const val = data[key];
          var clone = certificationsTemplate.content.cloneNode(true);
          clone.querySelector(".certifications-title").innerText = val["title"];
          clone.querySelector(".certifications-organisation").setAttribute("label", val["organisation"]);
          clone.querySelector(".certifications-date").setAttribute("label", val["completionDate"]);
          clone.querySelector(".certifications-link").setAttribute("link", val["certificateLink"]);
          certificationsContainer.appendChild(clone);
        }
      }

      this.removeSectionLoader();
      this.shadowRoot.querySelector("#certifications").append(certificationsContainer);
    }
  }

  addSectionLoader() {
    const sectionLoader = document.createElement("div");
    sectionLoader.setAttribute("class", "section-loader");

    const certifications = this.shadowRoot.querySelector("#certifications");
    certifications.append(sectionLoader);
  }

  removeSectionLoader() {
    this.shadowRoot.querySelector(".section-loader").remove();
  }
}

customElements.define("app-certifications", CertificationComponent);
