const SkillsTemplate = document.createElement("template");

class AppSkills extends HTMLElement {
  constructor() {
    super();
    // element created

    fetch("portfolio/components/sections/skills/skills.html")
      .then((response) => response.text())
      .then((html) => {
        // Inject the HTML into the shadow DOM
        SkillsTemplate.innerHTML = html;

        // Continue with your existing code...
        // (e.g., add event listeners, set up callbacks)
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(SkillsTemplate.content.cloneNode(true));

        const styles = [
          "portfolio/main.css",
          "portfolio/components/sections/skills/skills.css",
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
      this.fetchSkillsData(newValue);
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  // there can be other element methods and properties
  async fetchSkillsData(language = "en") {
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

customElements.define("app-skills", AppSkills);
