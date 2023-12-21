const ProjectsTemplate = document.createElement("template");

class AppProjects extends HTMLElement {
  constructor() {
    super();
    // element created

    fetch("portfolio/components/sections/projects/projects.html")
      .then((response) => response.text())
      .then((html) => {
        // Inject the HTML into the shadow DOM
        ProjectsTemplate.innerHTML = html;

        // Continue with your existing code...
        // (e.g., add event listeners, set up callbacks)
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(ProjectsTemplate.content.cloneNode(true));

        const styles = [
          "portfolio/components/sections/projects/projects.css",
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
      this.fetchProjectsData(newValue);
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  // there can be other element methods and properties
  async fetchProjectsData(language = "en") {
    const response = await fetch(`./portfolio/data/projects/${language}.projects.json`);
    const data = await response.json();
    this.loadProjects(data["projects"]);
  }

  loadProjects(data) {
    if ("content" in document.createElement("template")) {
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

    const onlineCertificates = this.shadowRoot.querySelector("#projects");
    onlineCertificates.append(sectionLoader);
  }

  removeSectionLoader() {
    this.shadowRoot.querySelector(".section-loader").remove();
  }
}

customElements.define("app-projects", AppProjects);
