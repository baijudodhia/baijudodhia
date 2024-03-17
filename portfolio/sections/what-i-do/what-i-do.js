class WhatIDoComponent extends HTMLElement {
  constructor(
    data = {},
    basePath = "/portfolio/sections/what-i-do",
    templateUrl = "/portfolio/sections/what-i-do/what-i-do.html",
    templateStyleUrls = [
      "/portfolio/main.css",
      "/portfolio/sections/what-i-do/what-i-do.css",
      "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css",
    ],
  ) {
    super();

    this.data = data;
    this.basePath = basePath;
    this.templateUrl = templateUrl;
    this.templateStyleUrls = templateStyleUrls;

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
