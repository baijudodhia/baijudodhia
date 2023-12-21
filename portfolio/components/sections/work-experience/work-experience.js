const WorkExperienceTemplate = document.createElement("template");

class AppWorkExperience extends HTMLElement {
  constructor() {
    super();

    fetch("portfolio/components/sections/work-experience/work-experience.html")
      .then((response) => response.text())
      .then((html) => {
        // Inject the HTML into the shadow DOM
        WorkExperienceTemplate.innerHTML = html;

        // Continue with your existing code...
        // (e.g., add event listeners, set up callbacks)
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(WorkExperienceTemplate.content.cloneNode(true));

        const link = document.createElement("link");
        link.setAttribute("href", "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css");
        link.setAttribute("rel", "stylesheet");
        this.shadowRoot.prepend(link);
      });
  }

  connectedCallback() {}

  static get observedAttributes() {
    return ["language"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "language" && oldValue !== newValue && newValue) {
      this.addSectionLoader();
      this.fetchWorkExperienceData(newValue);
    }
  }

  async fetchWorkExperienceData(language = "en") {
    const response = await fetch(`./portfolio/data/work-experience/${language}.work-experience.json`);
    const data = await response.json();
    this.loadWorkExperience(data.workExperience);
  }

  loadWorkExperience(data) {
    if ("content" in document.createElement("template")) {
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

customElements.define("app-work-experience", AppWorkExperience);
