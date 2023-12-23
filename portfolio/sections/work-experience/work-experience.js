class WorkExperienceComponent extends HTMLElement {
  constructor(
    templateUrl = "portfolio/sections/work-experience/work-experience.html",
    templateStyleUrls = [
      "portfolio/main.css",
      "portfolio/sections/work-experience/work-experience.css",
      "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css",
    ],
  ) {
    super();

    this.templateUrl = templateUrl;
    this.templateStyleUrls = templateStyleUrls;

    setComponentTemplate.call(
      this,
      () => {
        this.fetchWorkExperienceData();
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
      this.fetchWorkExperienceData(newValue);
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  async fetchWorkExperienceData(language = "en") {
    this.addSectionLoader();
    const response = await fetch(`./portfolio/data/work-experience/${language}.work-experience.json`);
    const data = await response.json();
    this.loadWorkExperience(data.workExperience);
  }

  loadWorkExperience(data) {
    if ("content" in document.createElement("template")) {
      // Remove the existing container if it exists
      const existingContainer = this.shadowRoot.querySelector("#work-experience-container");
      if (existingContainer) {
        existingContainer.remove();
      }

      const workExperienceContainer = document.createElement("div");
      workExperienceContainer.id = "work-experience-container";
      workExperienceContainer.innerHTML = "";
      const workExperienceTemplate = this.shadowRoot.querySelector("#work-experience-template");

      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const val = data[key];
          const clone = workExperienceTemplate.content.cloneNode(true);
          const company = val.company;

          clone.querySelector(".work-experience-organisation-logo").setAttribute("src", company.logo);
          clone.querySelector(".work-experience-organisation-logo").setAttribute("alt", company.name);
          clone.querySelector(".work-experience-organisation").setAttribute("label", company.name);
          clone.querySelector(".work-experience-location").setAttribute("label", company.location);
          clone.querySelector(".work-experience-industry").setAttribute("label", company.industry);
          clone.querySelector(".work-experience-type").setAttribute("label", company.domain);

          const profileDetails = clone.querySelector(".work-experience-profile-details").cloneNode(true);
          profileDetails.innerHTML = "";

          const positions = val.positions;
          for (let i = 0; i < positions.length; i++) {
            const position = positions[i];

            let profileDetailsItem = clone.querySelector(".work-experience-profile-details-item").cloneNode(true);
            profileDetailsItem.querySelector(".work-experience-profile").innerHTML = position["profile"];
            profileDetailsItem.querySelector(
              ".work-experience-date",
            ).innerHTML = `${position.fromDate} - ${position.toDate}`;
            profileDetailsItem.querySelector(".work-experience-description").innerHTML = position.description;

            profileDetails.appendChild(profileDetailsItem);
          }

          clone.querySelector(".work-experience-profile-details").innerHTML = profileDetails.innerHTML;

          workExperienceContainer.appendChild(clone);
        }
      }
      this.removeSectionLoader();
      this.shadowRoot.querySelector("#work-experience").appendChild(workExperienceContainer);
    }
  }

  addSectionLoader() {
    const sectionLoader = document.createElement("div");
    sectionLoader.setAttribute("class", "section-loader");

    const workExperience = this.shadowRoot.querySelector("#work-experience");
    workExperience.append(sectionLoader);
  }

  removeSectionLoader() {
    this.shadowRoot.querySelector(".section-loader")?.remove();
  }
}

customElements.define("app-work-experience", WorkExperienceComponent);
