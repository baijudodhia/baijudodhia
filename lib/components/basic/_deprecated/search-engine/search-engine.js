/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../../utils/index.js";
import searchEngineCssTemplate from "./search-engine.css";
import searchEngineHtmlTemplate from "./search-engine.html";

class AppSearchEngine extends HTMLElement {
  constructor(
    props = {
      id: "searchEngine",
      color: "",
    },
    basePath = "/components/core/search-engine",
    templateHtml = searchEngineHtmlTemplate,
    templateStyleUrls = [searchEngineCssTemplate],
  ) {
    super();

    this.props = props;
    this.basePath = basePath;
    this.templateHtml = templateHtml;
    this.templateStyleUrls = templateStyleUrls;

    setComponentTemplate.call(
      this,
      () => {
        this.render();
      },
      () => {
        console.log("Initial setup failed!");
      },
    );
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
      "language",
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
    if (name === "language") {
      this.shadowRoot.querySelector("app-language-menu").setAttribute("language", newValue);
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  getElement() {
    if (!this.shadowRoot) {
      return null;
    }

    const element = this.shadowRoot.querySelector("#search-engine");
    if (element) {
      element.remove();
    }

    let searchEngine = document.createElement("div");
    searchEngine.classList.add("search-engine");
    searchEngine.setAttribute("id", "search-engine");
    searchEngine.innerHTML = "";

    this.shadowRoot.appendChild(searchEngine);

    return searchEngine;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#search-engine-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  // there can be other element methods and properties
  render() {
    this.props = getComponentProps.call(this, this.props);
    const searchEngine = this.getElement();

    if (searchEngine && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the searchEngine element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "color") {
            const color_changer = this.shadowRoot.getElementById("search-engine-input");
            color_changer.value = window.HSLToHex(getComputedStyle(document.documentElement, null).getPropertyValue("--color-primary"));
          } else if (key === "id") {
            searchEngine.setAttribute(`${key}`, value);
          }
        }
      });

      // Render children
      searchEngine.innerHTML = ""; // Clear existing content
      searchEngine.appendChild(itemTemplate);
    }
  }
}

customElements.define("app-search-engine", AppSearchEngine);
