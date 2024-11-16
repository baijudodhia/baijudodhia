/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../../utils/index.js";
import languageMenuCssTemplate from "./language-menu.css";
import languageMenuHtmlTemplate from "./language-menu.html";

class AppLanguageMenu extends HTMLElement {
  constructor(
    props = {
      id: "languageMenu",
      color: "",
    },
    basePath = "/components/core/language-menu",
    templateHtml = languageMenuHtmlTemplate,
    templateStyleUrls = [languageMenuCssTemplate],
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
    return ["language"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
    if (name === "language") {
      if (oldValue !== null) {
        this.shadowRoot.querySelector(`#language-${oldValue}`).classList.remove("active");
      }
      this.shadowRoot.querySelector(`#language-${newValue}`).classList.add("active");
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

    const element = this.shadowRoot.querySelector("#language-menu");
    if (element) {
      element.remove();
    }

    let languageMenu = document.createElement("div");
    languageMenu.classList.add("language-menu");
    languageMenu.setAttribute("id", "language-menu");
    languageMenu.innerHTML = "";

    this.shadowRoot.appendChild(languageMenu);

    return languageMenu;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#language-menu-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  // there can be other element methods and properties
  render() {
    this.props = getComponentProps.call(this, this.props);
    const languageMenu = this.getElement();

    if (languageMenu && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the languageMenu element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "color") {
            const color_changer = this.shadowRoot.getElementById("language-menu-input");
            color_changer.value = window.HSLToHex(getComputedStyle(document.documentElement, null).getPropertyValue("--color-primary"));
          } else if (key === "id") {
            languageMenu.setAttribute(`${key}`, value);
          }
        }
      });

      // Render children
      languageMenu.innerHTML = ""; // Clear existing content
      languageMenu.appendChild(itemTemplate);
    }
  }
}

customElements.define("app-language-menu", AppLanguageMenu);
