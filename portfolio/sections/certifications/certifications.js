class CertificateComponent extends HTMLElement {
  constructor(
    props = {
      id: "certifications",
    },
    basePath = "/portfolio/sections/certifications",

    templateHtml = `
      <div id="certificates">
        <div class="certificates-header">
          <h3>Certifications</h3>
        </div>
        <div id="certificates-container"> </div>
      </div>

      <template id="certificate-body-template">
        <div
          class="certificate-body"
          style="flex-grow: 1; display: flex; flex-direction: column; column-gap: 1rem"
        >
          <div
            class="certificate-organisation"
            style="display: inline-flex; flex-direction: row; align-items: center; margin-bottom: 0.5rem"
          >
            <i
              style="margin-right: 0.5rem"
              class="fa fa-building"
            ></i>
          </div>
          <div
            class="certificate-platform"
            style="display: inline-flex; flex-direction: row; align-items: center; margin-bottom: 0.5rem"
          >
            <i
              style="margin-right: 0.5rem"
              class="fa fa-building"
            ></i>
          </div>
          <div
            class="certificate-issue-date"
            style="display: inline-flex; flex-direction: row; align-items: center"
          >
            <i
              style="margin-right: 0.5rem"
              class="fa fa-calendar-check-o"
            ></i>
          </div>
        </div>
      </template>

      <template id="certificate-links-template">
        <div
          class="certificate-links"
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
            id="certificate-link"
            appearance="secondary"
            label="certificate"
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
      #certificates {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  align-content: center;
  row-gap: 1.5rem;
}

.certificates-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-content: center;
  flex-direction: row;
  column-gap: 1rem;
}

#certificates-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-row-gap: 1.5rem;
  grid-column-gap: 1.5rem;
}
@media only screen and (max-width: 950px) {
  #certificates-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-row-gap: 1rem;
    grid-column-gap: 1rem;
  }
}
@media only screen and (max-width: 650px) {
  #certificates-container {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-row-gap: 1rem;
    grid-column-gap: 1rem;
  }
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
        console.log("Initial setup for app-certifications failed!");
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

    const response = await fetch(`${this.basePath}/data/${language}.certifications.json`);
    const data = await response.json();
    this.loadComponent(data);
  }

  loadComponent(data) {
    if ("content" in document.createElement("template")) {
      const resetContainer = () => {
        const existingContainer = this.shadowRoot.querySelector("#certificates-container");
        if (existingContainer) {
          existingContainer.remove();
        }

        let container = document.createElement("div");
        container.setAttribute("id", "certificates-container");
        container.innerHTML = "";

        return container;
      };

      const setupItemTemplate = (data, parentNode) => {
        const card = document.createElement("app-card");

        data.map((item, idx) => {
          const getCardBody = (item) => {
            const clone = this.shadowRoot.querySelector("#certificate-body-template").content.cloneNode(true);

            if (item?.organisation) {
              const organisationElement = document.createElement("span");
              organisationElement.textContent = item.organisation;
              clone.querySelector(".certificate-organisation").appendChild(organisationElement);
            } else {
              clone.querySelector(".certificate-organisation").remove();
            }

            if (item?.platform) {
              const platformElement = document.createElement("span");
              platformElement.textContent = item.platform;
              clone.querySelector(".certificate-platform").appendChild(platformElement);
            } else {
              clone.querySelector(".certificate-platform").remove();
            }

            if (item?.issueDate) {
              const issueDateElement = document.createElement("span");
              issueDateElement.textContent = item.issueDate;
              clone.querySelector(".certificate-issue-date").appendChild(issueDateElement);
            } else {
              clone.querySelector(".certificate-issue-date").remove();
            }

            return new XMLSerializer().serializeToString(clone);
          };

          const getCardFooter = (item) => {
            const clone = this.shadowRoot.querySelector("#certificate-links-template").content.cloneNode(true);

            if (item?.link) {
              clone.querySelector("#certificate-link").setAttribute("href", item.link);
            } else {
              clone.querySelector("#certificate-link").remove();
            }

            return new XMLSerializer().serializeToString(clone);
          };

          const clone = card.cloneNode(true);

          clone.setAttribute("id", `certificate-${idx}`);
          clone.setAttribute("header", item.title);
          clone.setAttribute("body", getCardBody(item));
          clone.setAttribute("footer", getCardFooter(item));

          parentNode.append(clone);
        });

        this.shadowRoot.querySelector("#certificates").append(parentNode);
      };

      const certificatesBody = resetContainer();
      setupItemTemplate(data["items"], certificatesBody);

      this.removeSectionLoader();
    }
  }

  addSectionLoader() {
    const sectionLoader = document.createElement("div");
    sectionLoader.setAttribute("class", "section-loader");

    const certificates = this.shadowRoot.querySelector("#certificates");
    certificates.append(sectionLoader);
  }

  removeSectionLoader() {
    this.shadowRoot.querySelector(".section-loader").remove();
  }
}

customElements.define("app-certifications", CertificateComponent);
