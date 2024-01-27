class WorkExperienceComponent extends HTMLElement {
  constructor(
    basePath = "/portfolio/sections/work-experience",
    templateUrl = "/portfolio/sections/work-experience/work-experience.html",
    templateStyleUrls = [
      "/portfolio/main.css",
      "/portfolio/sections/work-experience/work-experience.css",
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
            const clone = this.shadowRoot.querySelector("#work-experience-header-template").content.cloneNode(true);
            const header = clone.querySelector(".work-experience-header").cloneNode(true);

            const companyInfo = item.company;

            if (companyInfo?.logo) {
              header.querySelector(".work-experience-organisation-logo").setAttribute("src", companyInfo.logo);
              header.querySelector(".work-experience-organisation-logo").setAttribute("alt", companyInfo.name);
            } else {
              header.querySelector(".work-experience-organisation-logo").remove();
            }

            if (companyInfo?.name) {
              header.querySelector(".work-experience-organisation").setAttribute("label", companyInfo.name);
            } else {
              header.querySelector(".work-experience-organisation").remove();
            }

            if (companyInfo?.location) {
              header.querySelector(".work-experience-location").setAttribute("label", companyInfo.location);
            } else {
              header.querySelector(".work-experience-location").remove();
            }

            if (companyInfo?.industry) {
              header.querySelector(".work-experience-industry").setAttribute("label", companyInfo.industry);
            } else {
              header.querySelector(".work-experience-industry").remove();
            }

            if (companyInfo?.domain) {
              header.querySelector(".work-experience-type").setAttribute("label", companyInfo.domain);
            } else {
              header.querySelector(".work-experience-type").remove();
            }

            return header.outerHTML;
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
              detail.querySelector(".work-experience-profile").style.fontSize = "1.2rem";
              detail.querySelector(".work-experience-profile").style.fontWeight = "bold";
              detail.querySelector(".work-experience-date").innerHTML = `${position.fromDate} - ${position.toDate}`;
              detail.querySelector(".work-experience-date").style.fontSize = "0.8rem";
              detail.querySelector(".work-experience-date").style.fontWeight = "normal";
              detail.querySelector(".work-experience-description").innerHTML = position.description;
              detail.querySelector(".work-experience-description").style.fontSize = "1rem";
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
