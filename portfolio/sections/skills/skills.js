class SkillComponent extends HTMLElement {
  constructor(
    basePath = "/portfolio/sections/skills",
    templateUrl = "/portfolio/sections/skills/skills.html",
    templateStyleUrls = [
      "/portfolio/main.css",
      "/portfolio/sections/skills/skills.css",
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
        this.fetchSkillsData();
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
      this.fetchSkillsData(newValue);
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  // there can be other element methods and properties
  async fetchSkillsData(language = "en") {
    this.addSectionLoader();

    const response = await fetch(`${this.basePath}/data/${language}.skills.json`);
    const data = await response.json();
    this.loadSkills(data);
  }

  loadSkills(data) {
    if ("content" in document.createElement("template")) {
      const resetContainer = () => {
        const existingContainer = this.shadowRoot.querySelector("#skills-container");
        if (existingContainer) {
          existingContainer.remove();
        }

        let skillsContainer = document.createElement("div");
        skillsContainer.setAttribute("id", "skills-container");
        skillsContainer.innerHTML = "";

        return skillsContainer;
      };

      const setupItemTemplate = (data, parentNode) => {
        const itemTemplate = this.shadowRoot.querySelector("#skills-item-template");

        data.map((item, idx) => {
          const clone = itemTemplate.content.cloneNode(true);

          clone.querySelector(".skills-item-category").innerText = item.category;
          clone.querySelector(".skills-item-list").innerText = item.list.join(", ");

          parentNode.append(clone);
        });

        this.shadowRoot.querySelector("#skills").append(parentNode);
      };

      const skillsBody = resetContainer();
      setupItemTemplate(data["skills"], skillsBody);

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
