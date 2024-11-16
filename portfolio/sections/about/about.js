class AboutComponent extends HTMLElement {
  constructor(
    props = {
      id: "about",
    },
    basePath = "/portfolio/sections/about",

    templateHtml = `
      <div id="about">
        <h1>
          <div class="about-name-container">
            <div
              class="about-name"
              title="Baiju Dodhia"
              >Baiju Dodhia</div
            >
            <app-search-engine></app-search-engine>
          </div>
        </h1>
        <div>
          Software Engineer with entrepreneurial mindset having strong project-based knowledge of various technical
          skills including programming languages and software tools.
        </div>
        <div class="about-profile">
          Currently working as Senior Software Engineer at
          <app-button
            appearance="link"
            label="Think360"
            type="link"
            href="https://www.think360.ai/"
          ></app-button>
        </div>
        <app-social-links
          github
          linkedin
          blog
        ></app-social-links>
        <!-- What I Do ? -->
        <app-what-i-do></app-what-i-do>
      </div>
    `,
    templateStyleUrls = [
      `
      #about {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: flex-start;
  row-gap: 20px;
}
#about > h1,
#about > h2 {
  margin: 0px;
}
#about > h1 * {
  font-size: 28px !important;
}
#about > h1 app-link::part(link_title) {
  font-size: 28px !important;
}
.about-name-container {
  display: inline-flex;
  align-items: center;
  column-gap: 10px;
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
        console.log("Initial setup for app-about failed!");
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
    try {
      const response = await fetch(`${this.basePath}/data/${language}.about.json`);
      const data = await response.json();
      const aboutName = this.shadowRoot.querySelector(".about-name");

      if (aboutName) {
        aboutName.setAttribute("title", data["name"]);
        aboutName.innerHTML = data["name"];
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
    }
  }
}

customElements.define("app-about", AboutComponent);
