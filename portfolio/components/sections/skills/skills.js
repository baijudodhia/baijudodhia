class SkillComponent extends HTMLElement {
  constructor(
    templateUrl = "portfolio/components/sections/skills/skills.html",
    templateStyleUrls = [
      "portfolio/main.css",
      "portfolio/components/sections/skills/skills.css",
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
      this.fetchSkillsData(newValue);
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

    this.fetchSkillsData();
  }

  // there can be other element methods and properties
  async fetchSkillsData(language = "en") {
    this.addSectionLoader();

    const response = await fetch(`./portfolio/data/skills/${language}.skills.json`);
    const data = await response.json();
    this.loadSkills(data["skills"]);
  }

  loadSkills(data) {
    if ("content" in document.createElement("template")) {
      // Remove the existing container if it exists
      const existingContainer = this.shadowRoot.querySelector("#skills-container");
      if (existingContainer) {
        existingContainer.remove();
      }

      let skillsContainer = document.createElement("div");
      skillsContainer.setAttribute("id", "skills-container");
      skillsContainer.innerHTML = "";
      let skillsTemplate = this.shadowRoot.querySelector("#skills-template");
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          const val = data[key];
          var clone = skillsTemplate.content.cloneNode(true);
          clone.querySelector("#skill-type").innerText = val["skillType"];
          clone.querySelector("#skill-list").innerText = val["skillList"].join(", ");
          skillsContainer.appendChild(clone);
        }
      }
      this.removeSectionLoader();
      this.shadowRoot.querySelector("#skills").append(skillsContainer);
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
