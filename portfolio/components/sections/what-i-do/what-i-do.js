const WhatIDoTemplate = document.createElement("template");

class AppWhatIDo extends HTMLElement {
  constructor() {
    super();
    // element created

    fetch("portfolio/components/sections/what-i-do/what-i-do.html")
      .then((response) => response.text())
      .then((html) => {
        // Inject the HTML into the shadow DOM
        WhatIDoTemplate.innerHTML = html;

        // Continue with your existing code...
        // (e.g., add event listeners, set up callbacks)
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(WhatIDoTemplate.content.cloneNode(true));

        const styles = [
          "portfolio/main.css",
          "portfolio/components/sections/what-i-do/what-i-do.css",
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
    return [
      /* Attributes to observe. */
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  // there can be other element methods and properties
}

customElements.define("app-what-i-do", AppWhatIDo);
