const AboutTemplate = document.createElement("template");

class AppAbout extends HTMLElement {
  constructor() {
    super();
    // element created

    fetch("portfolio/components/sections/about/about.html")
      .then((response) => response.text())
      .then((html) => {
        // Inject the HTML into the shadow DOM
        AboutTemplate.innerHTML = html;

        // Continue with your existing code...
        // (e.g., add event listeners, set up callbacks)
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(AboutTemplate.content.cloneNode(true));

        const link = document.createElement("link");
        link.setAttribute("href", "https://baijudodhia.github.io/portfolio/main.css");
        link.setAttribute("rel", "stylesheet");
        this.shadowRoot.prepend(link);

        link.setAttribute("href", "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css");
        link.setAttribute("rel", "stylesheet");
        this.shadowRoot.prepend(link);
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
      this.fetchAboutData(newValue);
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  // there can be other element methods and properties
  async fetchAboutData(language = "en") {
    const response = await fetch(`./portfolio/data/about/${language}.about.json`);
    const data = await response.json();
    this.shadowRoot.querySelector(".about-name").setAttribute("title", data["name"]);
    this.shadowRoot.querySelector(".about-name").innerHTML = data["name"];
  }
}

customElements.define("app-about", AppAbout);
