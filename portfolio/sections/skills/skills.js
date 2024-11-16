class SkillComponent extends HTMLElement {
  constructor(
    props = {
      id: "skills",
    },
    basePath = "/portfolio/sections/skills",

    templateHtml = `
      <div id="skills">
        <div id="skills-header">
          <h3> Skills </h3>
        </div>
        <div id="skills-container"> </div>
      </div>
    `,
    templateStyleUrls = [
      `
      #skills {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  align-content: center;
  row-gap: 1.5rem;
}

.skills-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-content: center;
  flex-direction: row;
  column-gap: 1rem;
}

#skills-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-row-gap: 1.5rem;
  grid-column-gap: 1.5rem;
}
@media only screen and (max-width: 720px) {
  #skills-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-row-gap: 1rem;
    grid-column-gap: 1rem;
  }
}
@media only screen and (max-width: 600px) {
  #skills-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
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
        this.fetchData();
      },
      () => {
        console.log("Initial setup for app-skills failed!");
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
      this.fetchData(newValue);
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  // there can be other element methods and properties
  async fetchData(language = "en") {
    this.addSectionLoader();

    const response = await fetch(`${this.basePath}/data/${language}.skills.json`);
    const data = await response.json();
    this.loadComponent(data);
  }

  loadComponent(data) {
    if ("content" in document.createElement("template")) {
      const resetContainer = () => {
        const existingContainer = this.shadowRoot.querySelector("#skills-container");
        if (existingContainer) {
          existingContainer.remove();
        }

        let container = document.createElement("div");
        container.setAttribute("id", "skills-container");
        container.innerHTML = "";

        return container;
      };

      const setupItemTemplate = (data, parentNode) => {
        const card = document.createElement("app-card");

        data.map((item, idx) => {
          const clone = card.cloneNode(true);

          clone.setAttribute("id", `skill-${idx}`);
          clone.setAttribute("header", item.category);
          clone.setAttribute("body", item.list.join(", "));

          parentNode.append(clone);
        });

        this.shadowRoot.querySelector("#skills").append(parentNode);
      };

      const skillsBody = resetContainer();
      setupItemTemplate(data["items"], skillsBody);

      this.removeSectionLoader();
    }
  }

  addSectionLoader() {
    const sectionLoader = document.createElement("div");
    sectionLoader.setAttribute("class", "section-loader");

    const skills = this.shadowRoot.querySelector("#skills");
    skills.append(sectionLoader);
  }

  removeSectionLoader() {
    this.shadowRoot.querySelector(".section-loader").remove();
  }
}

customElements.define("app-skills", SkillComponent);
