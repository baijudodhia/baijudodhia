/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../../utils/index.js";
import searchEngineMenuCssTemplate from "./search-engine-menu.css";
import searchEngineMenuHtmlTemplate from "./search-engine-menu.html";

class AppsearchEngineMenu extends HTMLElement {
  constructor(
    props = {
      id: "searchEngineMenu",
      color: "",
    },
    basePath = "/components/core/search-engine-menu",
    templateHtml = searchEngineMenuHtmlTemplate,
    templateStyleUrls = [searchEngineMenuCssTemplate],
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
      /* Value to watch for */
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  getElement() {
    if (!this.shadowRoot) {
      return null;
    }

    const element = this.shadowRoot.querySelector("#search-engine-menu");
    if (element) {
      element.remove();
    }

    let searchEngineMenu = document.createElement("div");
    searchEngineMenu.classList.add("search-engine-menu");
    searchEngineMenu.setAttribute("id", "search-engine-menu");
    searchEngineMenu.innerHTML = "";

    this.shadowRoot.appendChild(searchEngineMenu);

    return searchEngineMenu;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#search-engine-menu-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  // there can be other element methods and properties
  render() {
    this.props = getComponentProps.call(this, this.props);
    const searchEngineMenu = this.getElement();

    if (searchEngineMenu && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the searchEngineMenu element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "color") {
            const color_changer = this.shadowRoot.getElementById("search-engine-menu-input");
            color_changer.value = window.HSLToHex(getComputedStyle(document.documentElement, null).getPropertyValue("--color-primary"));
          } else if (key === "id") {
            searchEngineMenu.setAttribute(`${key}`, value);
          }
        }
      });

      // Render children
      searchEngineMenu.innerHTML = ""; // Clear existing content
      searchEngineMenu.appendChild(itemTemplate);
    }
  }
}

customElements.define("app-search-engine-menu", AppsearchEngineMenu);
