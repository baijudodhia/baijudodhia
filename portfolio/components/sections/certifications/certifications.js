const OnlineCertificatesTemplate = document.createElement("template");

class AppOnlineCertificates extends HTMLElement {
  constructor() {
    super();
    // element created

    fetch("portfolio/components/sections/certifications/certifications.html")
      .then((response) => response.text())
      .then((html) => {
        // Inject the HTML into the shadow DOM
        OnlineCertificatesTemplate.innerHTML = html;

        // Continue with your existing code...
        // (e.g., add event listeners, set up callbacks)
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(OnlineCertificatesTemplate.content.cloneNode(true));

        const styles = [
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
      this.fetchOnlineCertificatesData(newValue);
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  // there can be other element methods and properties
  async fetchOnlineCertificatesData(language = "en") {
    const response = await fetch(`./portfolio/data/online-certificates/${language}.online-certificates.json`);
    const data = await response.json();
    this.loadOnlineCertifications(data["certificates"]);
  }

  loadOnlineCertifications(data) {
    if ("content" in document.createElement("template")) {
      let onlineCertificatesContainer = document.createElement("div");
      onlineCertificatesContainer.setAttribute("id", "online-certificates-container");
      onlineCertificatesContainer.innerHTML = "";
      let onlineCertificatesTemplate = this.shadowRoot.querySelector("#online-certificates-template");
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          const val = data[key];
          var clone = onlineCertificatesTemplate.content.cloneNode(true);
          clone.querySelector(".online-certificates-title").innerText = val["title"];
          clone.querySelector(".online-certificates-organisation").setAttribute("label", val["organisation"]);
          clone.querySelector(".online-certificates-date").setAttribute("label", val["completionDate"]);
          clone.querySelector(".online-certificates-link").setAttribute("link", val["certificateLink"]);
          onlineCertificatesContainer.appendChild(clone);
        }
      }
      this.removeSectionLoader();
      this.shadowRoot.querySelector("#online-certificates").append(onlineCertificatesContainer);
    }
  }

  addSectionLoader() {
    const sectionLoader = document.createElement("div");
    sectionLoader.setAttribute("class", "section-loader");

    const onlineCertificates = this.shadowRoot.querySelector("#online-certificates");
    onlineCertificates.append(sectionLoader);
  }

  removeSectionLoader() {
    this.shadowRoot.querySelector(".section-loader").remove();
  }
}

customElements.define("app-online-certificates", AppOnlineCertificates);
