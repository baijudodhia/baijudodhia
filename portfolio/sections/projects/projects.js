class ProjectComponent extends HTMLElement {
  constructor(
    props = {
      id: "projects",
    },
    basePath = "/portfolio/sections/projects",

    templateHtml = `
      <div id="projects">
        <div class="projects-header">
          <h3>Projects</h3>
          <app-button
            id="app-view-all"
            appearance="secondary"
            label="view all"
            type="link"
            size="m"
            href="https://github.com/baijudodhia?tab=repositories"
            icon-right="fas fa-external-link-square-alt"
          ></app-button>
        </div>
        <div id="projects-container"> </div>
      </div>

      <template id="project-links-template">
        <div
          class="project-links"
          style="
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      align-content: center;
      column-gap: 1rem;
    "
        >
          <app-button
            id="app-link-code"
            appearance="secondary"
            label="code"
            type="link"
            size="s"
            href=""
            icon-right="fa fa-code"
          ></app-button>
          <app-button
            id="app-link-live"
            appearance="secondary"
            label="live"
            type="link"
            size="s"
            href=""
            icon-right="fas fa-external-link-square-alt"
          ></app-button>
        </div>
      </template>
    `,
    templateStyleUrls = [
      `
      #projects {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  align-content: center;
  row-gap: 1.5rem;
}

.projects-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-content: center;
  flex-direction: row;
  column-gap: 1rem;
}

#projects-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-row-gap: 1.5rem;
  grid-column-gap: 1.5rem;
}
@media only screen and (max-width: 950px) {
  #projects-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-row-gap: 1rem;
    grid-column-gap: 1rem;
  }
}
@media only screen and (max-width: 650px) {
  #projects-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

.project-links {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  align-content: center;
  column-gap: 1rem;
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
        console.log("Initial setup for app-projects failed!");
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
