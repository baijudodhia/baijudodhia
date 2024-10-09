class WhatIDoComponent extends HTMLElement {
  constructor(
    props = {
      id: "what-id-do",
    },
    data = {},
    basePath = "/portfolio/sections/what-i-do",

    templateHtml = `
      <div id="what-i-do">
        <h3 id="what-i-do-title"></h3>
        <div id="what-i-do-container">
          <div class="what-i-do-left">
            <div id="what-i-do-line1"> </div>
            <div id="what-i-do-line2"> </div>
          </div>
          <div class="what-i-do-divider"></div>
          <div class="what-i-do-right">
            <span id="what-i-do-line3"> </span>
            <br />
            <app-button
              appearance="link"
              type="link"
              label="BloomBox, E-Cell KJSCE"
              title="BloomBox, E-Cell KJSCE"
              href="https://www.bloomboxkjsce.com/"
            ></app-button>
            ,&nbsp;<br />
            <app-button
              appearance="link"
              type="link"
              label="RedShift Racing India"
              title="RedShift Racing India"
              href="http://www.redshift-racing.in/"
            ></app-button>
            ,&nbsp;<br />
            <app-button
              appearance="link"
              type="link"
              label="CSI KJSCE"
              title="CSI KJSCE"
              href="https://www.csikjsce.org/"
            ></app-button>
            ,&nbsp;<br />
            <app-button
              appearance="link"
              type="link"
              label="Hult Prize Somaiya"
              title="Hult Prize Somaiya"
              href="https://www.hultprize.org/"
            ></app-button>
          </div>
        </div>
      </div>
    `,
    templateStyleUrls = [
      `
      #what-i-do {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: stretch;
  row-gap: 20px;
}
#what-i-do-container {
  display: flex;
  align-items: stretch;
  justify-content: center;
  align-content: center;
  flex-direction: row;
  column-gap: 20px;
}
@media only screen and (max-width: 931px) {
  #what-i-do-container {
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    align-items: stretch;
    row-gap: 20px;
  }
}
.what-i-do-left {
  flex-basis: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: stretch;
  row-gap: 20px;
}
.what-i-do-divider {
  display: block;
  align-self: stretch;
  border-right: 2px dashed var(--color-bw_secondary_invert);
}
@media only screen and (max-width: 931px) {
  .what-i-do-divider {
    display: none;
  }
}
.what-i-do-right {
  flex-basis: 0;
  flex-grow: 1;
}

      `,
      "/portfolio/main.css",
      "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css",
    ],
  ) {
    super();

    this.data = data;
    this.basePath = basePath;
    this.templateHtml = templateHtml;
    this.templateStyleUrls = templateStyleUrls;
    this.props = props;

    setComponentTemplate.call(
      this,
      () => {
        this.setComponentContent();
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
    if (name === "language" && oldValue !== newValue && newValue) {
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  async getComponentContent(language = "en") {
    const response = await fetch(`${this.basePath}/data/${language}.what-i-do.json`);
    const data = await response.json();

    return data;
  }

  // there can be other element methods and properties
  async setComponentContent() {
    this.data = await this.getComponentContent();

    const setTitle = () => {
      this.shadowRoot.querySelector("#what-i-do-title").innerHTML = `${this.data.title}`;
      this.shadowRoot.querySelector("#what-i-do-line1").innerHTML = `${this.data.body.line1}`;
      this.shadowRoot.querySelector("#what-i-do-line2").innerHTML = `${this.data.body.line2}`;
      this.shadowRoot.querySelector("#what-i-do-line3").innerHTML = `${this.data.body.line3}`;
    };

    const setBody = () => {
      this.shadowRoot.querySelector("");
    };

    if ("content" in document.createElement("template")) {
      setTitle();
    }
  }
}

customElements.define("app-what-i-do", WhatIDoComponent);
