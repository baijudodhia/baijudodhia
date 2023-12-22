class ProjectComponent extends HTMLElement {
  constructor(
    templateUrl = "portfolio/components/sections/projects/projects.html",
    templateStyleUrls = [
      "portfolio/main.css",
      "portfolio/components/sections/projects/projects.css",
      "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css",
    ],
  ) {
    super();

    this.templateUrl = templateUrl;
    this.templateStyleUrls = templateStyleUrls;

    setComponentTemplate.call(
      this,
      () => {
        this.fetchProjectsData();
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
      this.fetchProjectsData(newValue);
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

    this.fetchProjectsData();
  }

  // there can be other element methods and properties
  async fetchProjectsData(language = "en") {
    this.addSectionLoader();

    const response = await fetch(`./portfolio/data/projects/${language}.projects.json`);
    const data = await response.json();
    this.loadProjects(data["projects"]);
  }

  loadProjects(data) {
    if ("content" in document.createElement("template")) {
      // Remove the existing container if it exists
      const existingContainer = this.shadowRoot.querySelector("#projects-container");
      if (existingContainer) {
        existingContainer.remove();
      }

      let projectsContainer = document.createElement("div");
      projectsContainer.setAttribute("id", "projects-container");
      projectsContainer.innerHTML = "";
      let projectsTemplate = this.shadowRoot.querySelector("#projects-template");
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          const val = data[key];
          var clone = projectsTemplate.content.cloneNode(true);
          clone.querySelector(".project-title").innerText = val["title"];
          clone.querySelector(".project-description").innerText = val["description"];
          if (val["code"]["linkExists"] === true) {
            clone.querySelector(".app-link-code").setAttribute("link", val["code"]["codeLink"]);
          } else {
            clone.querySelector(".app-link-code").remove();
          }
          if (val.hosted.linkExists) {
            clone.querySelector(".app-link-live").setAttribute("link", val["hosted"]["hostedLink"]);
          } else {
            clone.querySelector(".app-link-live").remove();
          }
          projectsContainer.appendChild(clone);
        }
      }
      this.removeSectionLoader();
      this.shadowRoot.querySelector("#projects").append(projectsContainer);
    }
  }

  addSectionLoader() {
    // Section Loader
    const sectionLoader = document.createElement("div");
    sectionLoader.setAttribute("class", "section-loader");

    const projects = this.shadowRoot.querySelector("#projects");
    projects.append(sectionLoader);
  }

  removeSectionLoader() {
    this.shadowRoot.querySelector(".section-loader").remove();
  }
}

customElements.define("app-projects", ProjectComponent);
