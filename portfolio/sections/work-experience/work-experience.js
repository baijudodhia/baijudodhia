class WorkExperienceComponent extends HTMLElement {
  constructor(
    props = {
      id: "work-experience",
    },
    basePath = "/portfolio/sections/work-experience",

    templateHtml = `
      <div id="work-experiences">
        <div class="work-experiences-header">
          <h3>Work Experience</h3>
        </div>
        <div id="work-experiences-container"> </div>
      </div>

      <template id="work-experience-profile-detail-template">
        <div class="work-experience-profile-detail">
          <div class="work-experience-profile-detail-header">
            <div class="work-experience-profile"></div>
            <div class="work-experience-date"></div>
          </div>
          <div class="work-experience-description"></div>
        </div>
      </template>
    `,
    templateStyleUrls = [
      `
      #work-experiences {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  align-content: center;
  row-gap: 1.5rem;
}

.work-experiences-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-content: center;
  flex-direction: row;
  column-gap: 1rem;
}

#work-experiences-container {
  display: inline-flex;
  flex-direction: column;
  gap: 1.5rem;
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
        console.log("Initial setup for app-work-experience failed!");
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

  async fetchData(language = "en") {
    this.addSectionLoader();
    const response = await fetch(`${this.basePath}/data/${language}.work-experience.json`);
    const data = await response.json();
    this.loadComponent(data);
  }

  loadComponent(data) {
    if ("content" in document.createElement("template")) {
      const resetContainer = () => {
        const existingContainer = this.shadowRoot.querySelector("#work-experiences-container");
        if (existingContainer) {
          existingContainer.remove();
        }

        let container = document.createElement("div");
        container.setAttribute("id", "work-experiences-container");
        container.innerHTML = "";

        return container;
      };

      const setupItemTemplate = (data, parentNode) => {
        const card = document.createElement("app-card");

        data.map((item, idx) => {
          const getCardHeader = (item) => {
            const header = document.createElement("app-work-experience-header");

            const companyInfo = item.company;

            if (companyInfo?.logo) {
              header.setAttribute("logo", companyInfo.logo);
            }

            if (companyInfo?.name) {
              header.setAttribute("organisation", companyInfo.name);
            }

            if (companyInfo?.location) {
              header.setAttribute("location", companyInfo.location);
            }
            if (companyInfo?.industry) {
              header.setAttribute("industry", companyInfo.industry);
            }

            if (companyInfo?.domain) {
              header.setAttribute("type", companyInfo.domain);
            }

            return new XMLSerializer().serializeToString(header);
          };

          const getCardBody = (item) => {
            const companyPositions = item.positions;
            const clone = this.shadowRoot
              .querySelector("#work-experience-profile-detail-template")
              .content.cloneNode(true);
            const timeline = document.createElement("app-timeline").cloneNode(true);

            for (let i = 0; i < companyPositions.length; i++) {
              const position = companyPositions[i];
              const detail = clone.querySelector(".work-experience-profile-detail").cloneNode(true);

              detail.querySelector(".work-experience-profile").innerHTML = position.profile;
              detail.querySelector(".work-experience-profile").style.fontSize = "1em";
              detail.querySelector(".work-experience-profile").style.fontWeight = "bold";
              detail.querySelector(".work-experience-date").innerHTML = `${position.fromDate} - ${position.toDate}`;
              detail.querySelector(".work-experience-date").style.fontSize = "0.8em";
              detail.querySelector(".work-experience-date").style.fontWeight = "normal";
              detail.querySelector(".work-experience-description").innerHTML = position.description;
              detail.querySelector(".work-experience-description").style.fontSize = "0.9em";
              detail.querySelector(".work-experience-description").style.fontWeight = "normal";

              timeline.appendChild(detail);
            }

            return new XMLSerializer().serializeToString(timeline);
          };

          const clone = card.cloneNode(true);

          clone.setAttribute("id", `work-experience-${idx}`);
          clone.setAttribute("header", getCardHeader(item));
          clone.setAttribute("body", getCardBody(item));

          parentNode.append(clone);
        });

        this.shadowRoot.querySelector("#work-experiences").append(parentNode);
      };

      const workExperienceBody = resetContainer();
      setupItemTemplate(data["items"], workExperienceBody);

      this.removeSectionLoader();
    }
  }

  addSectionLoader() {
    const sectionLoader = document.createElement("div");
    sectionLoader.setAttribute("class", "section-loader");

    const workExperience = this.shadowRoot.querySelector("#work-experiences");
    workExperience.append(sectionLoader);
  }

  removeSectionLoader() {
    this.shadowRoot.querySelector(".section-loader")?.remove();
  }
}

customElements.define("app-work-experience", WorkExperienceComponent);
