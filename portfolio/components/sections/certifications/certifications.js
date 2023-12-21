const CertificationsTemplate = document.createElement("template");

class AppCertifications extends HTMLElement {
  constructor() {
    super();
    // element created

    fetch("portfolio/components/sections/certifications/certifications.html")
      .then((response) => response.text())
      .then((html) => {
        // Inject the HTML into the shadow DOM
        CertificationsTemplate.innerHTML = html;

        // Continue with your existing code...
        // (e.g., add event listeners, set up callbacks)
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(CertificationsTemplate.content.cloneNode(true));

        const styles = [
          "portfolio/main.css",
          "portfolio/components/sections/certifications/certifications.css",
          "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css",
        ];

        // Call is a prototype for Functions in JS, which correctly binds the context of this
        setStyles.call(this, styles);
      });
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
    if (
      name === "language" &&
      oldValue !== newValue &&
      newValue !== null &&
      newValue !== undefined &&
      newValue !== ""
    ) {
      this.addSectionLoader();
      this.fetchCertificationsData(newValue);
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  // there can be other element methods and properties
  async fetchCertificationsData(language = "en") {
    const response = await fetch(`./portfolio/data/certifications/${language}.certifications.json`);
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

customElements.define("app-certifications", AppCertifications);
