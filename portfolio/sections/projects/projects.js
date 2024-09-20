class ProjectComponent extends HTMLElement {
  constructor(
    props = {
      id: "projects",
    },
    basePath = "/portfolio/sections/projects",
    templateUrl = "/portfolio/sections/projects/projects.html",
    templateStyleUrls = [
      "/portfolio/main.css",
      "/portfolio/sections/projects/projects.css",
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
        this.fetchData();
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

    const response = await fetch(`${this.basePath}/data/${language}.projects.json`);
    const data = await response.json();
    this.loadComponent(data);
  }

  loadComponent(data) {
    if ("content" in document.createElement("template")) {
      const resetContainer = () => {
        const existingContainer = this.shadowRoot.querySelector("#projects-container");
        if (existingContainer) {
          existingContainer.remove();
        }

        let container = document.createElement("div");
        container.setAttribute("id", "projects-container");
        container.innerHTML = "";

        return container;
      };

      const setupItemTemplate = (data, parentNode) => {
        const card = document.createElement("app-card");

        data.map((item, idx) => {
          const getCardFooter = () => {
            const projectLinksClone = this.shadowRoot.querySelector("#project-links-template").content.cloneNode(true);

            if (item?.code?.linkExists) {
              projectLinksClone.querySelector("#app-link-code").setAttribute("href", item.code.codeLink);
            } else {
              projectLinksClone.querySelector("#app-link-code").remove();
            }

            if (item?.hosted?.linkExists) {
              projectLinksClone.querySelector("#app-link-live").setAttribute("href", item.hosted.hostedLink);
            } else {
              projectLinksClone.querySelector("#app-link-live").remove();
            }

            // Convert the content of projectLinksClone to HTML string
            const projectLinksHTML = new XMLSerializer().serializeToString(projectLinksClone);

            return projectLinksHTML;
          };

          const clone = card.cloneNode(true);

          clone.setAttribute("id", `project-${idx}`);
          clone.setAttribute("header", item.title);
          clone.setAttribute("body", item.description);
          clone.setAttribute("footer", getCardFooter());

          parentNode.append(clone);
        });

        this.shadowRoot.querySelector("#projects").append(parentNode);
      };

      const projectsBody = resetContainer();
      setupItemTemplate(data["items"], projectsBody);

      this.removeSectionLoader();
    }
  }

  addSectionLoader() {
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
