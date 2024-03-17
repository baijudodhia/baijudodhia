class WorkExperienceHeaderComponent extends HTMLElement {
  constructor(
    props = {
      id: "work-experience-header",
      logo: "",
      organisation: "",
      location: "",
      industry: "",
      type: "",
    },
    basePath = "/portfolio/sections/work-experience/work-experience-header",
    templateUrl = "/portfolio/sections/work-experience/work-experience-header/work-experience-header.html",
    templateStyleUrls = [
      "/portfolio/main.css",
      "/portfolio/sections/work-experience/work-experience-header/work-experience-header.css",
      "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css",
    ],
  ) {
    super();

    this.props = props;
    this.basePath = basePath;
    this.templateUrl = templateUrl;
    this.templateStyleUrls = templateStyleUrls;

    setComponentTemplate.call(
      this,
      () => {
        this.render();
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
    return ["id", "logo", "organisation", "location", "industry", "type"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && newValue) {
      this.props[name] = newValue;
      this.render();
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  getElement() {
    if (!this.shadowRoot) {
      return null;
    }

    const element = this.shadowRoot.querySelector("div");
    if (element) {
      element.remove();
    }

    let div = document.createElement("div");
    div.classList.add("div");
    div.setAttribute("id", "work-experience-header");
    div.innerHTML = "";

    this.shadowRoot.appendChild(div);

    return div;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#work-experience-header-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  render() {
    this.props = getComponentProps.call(this, this.props);
    const element = this.getElement(this.props.type);

    if (element && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the button element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "id") {
            element.setAttribute(`${key}`, value);
          } else if (key === "logo") {
            itemTemplate.querySelector(".work-experience-organisation-logo").src = value;
          } else if (key === "organisation") {
            itemTemplate.querySelector(".work-experience-detail-organisation").innerText = value;
          } else if (key === "location") {
            itemTemplate.querySelector(".work-experience-detail-location").innerText = value;
          } else if (key === "type") {
            itemTemplate.querySelector(".work-experience-detail-type").innerText = value;
          } else if (key === "industry") {
            itemTemplate.querySelector(".work-experience-detail-industry").innerText = value;
          }
        }
      });

      element.innerHTML = ""; // Clear existing content
      element.appendChild(itemTemplate);
    }
  }
}

customElements.define("app-work-experience-header", WorkExperienceHeaderComponent);
