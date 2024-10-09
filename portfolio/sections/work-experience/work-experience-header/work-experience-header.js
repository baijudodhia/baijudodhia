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

    templateHtml = `
      <div id="work-experience-header-container"></div>

      <template id="work-experience-header-template">
        <div class="work-experience-header">
          <div class="work-experience-organisation-logo-container">
            <img
              class="work-experience-organisation-logo"
              src=""
              alt=""
            />
          </div>
          <div class="work-experience-details">
            <div
              class="work-experience-detail-item"
              title="Work Organisation"
            >
              <i class="fa fa-building"></i>
              <div class="work-experience-detail-organisation"></div>
            </div>
            <div
              class="work-experience-detail-item"
              title="Work Location"
            >
              <i class="fa fa-map-marker-alt"></i>
              <div class="work-experience-detail-location"></div>
            </div>
            <div
              class="work-experience-detail-item"
              title="Work Type"
            >
              <i class="fa fa-tasks"></i>
              <div class="work-experience-detail-type"></div>
            </div>
            <div
              class="work-experience-detail-item"
              title="Work Industry"
            >
              <i class="fa fa-industry"></i>
              <div class="work-experience-detail-industry"></div>
            </div>
          </div>
        </div>
      </template>
    `,
    templateStyleUrls = [
      `
      .work-experience-header {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  column-gap: 1.5rem;
}
@media only screen and (max-width: 931px) {
  .work-experience-header {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
    row-gap: 1rem;
  }
}

.work-experience-details {
  align-self: stretch;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-row-gap: 0.5rem;
  grid-column-gap: 1rem;
  width: 100%;
}
@media only screen and (max-width: 600px) {
  .work-experience-details {
    align-self: stretch;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-row-gap: 0.5rem;
    grid-column-gap: 1rem;
  }
}

.work-experience-organisation-logo-container {
  object-fit: contain;
  width: 100%;
  min-width: unset;
  max-width: 280px;
  max-height: 70px;
  min-height: unset;
  display: flex;
  align-self: stretch;
  justify-content: center;
  align-content: center;
  flex-direction: row;
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 1rem;
  border-width: 1px;
  border-style: solid;
  border-color: var(--color-primary);
  box-shadow: 0px 2px 10px -3px var(--color-primary);
}

@media only screen and (max-width: 931px) {
  .work-experience-organisation-logo-container {
    object-fit: contain;
    width: 100%;
    height: 100px;
    min-width: unset;
    max-width: unset;
    max-height: unset;
    min-height: unset;
    display: flex;
    align-self: stretch;
    justify-content: center;
    align-content: center;
    flex-direction: row;
    background-color: #ffffff;
    border-radius: 0.5rem;
    padding: 1rem;
    border-width: 1px;
    border-style: solid;
    border-color: var(--color-primary);
    box-shadow: 0px 2px 10px -3px var(--color-primary);
  }
}

.work-experience-organisation-logo {
  width: 100%;
  height: 100%;
}

.work-experience-detail-item {
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
}

      `,
      "/portfolio/main.css",
      "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css",
    ],
  ) {
    super();

    this.props = props;
    this.basePath = basePath;
    this.templateHtml = templateHtml;
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
