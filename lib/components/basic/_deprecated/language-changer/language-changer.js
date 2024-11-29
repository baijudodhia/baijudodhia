/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../../utils/index.js";
import languageChangerCssTemplate from "./language-changer.css";
import languageChangerHtmlTemplate from "./language-changer.html";

class AppLanguageChanger extends HTMLElement {
  constructor(
    props = {
      id: "languageChanger",
      color: "",
    },
    basePath = "/components/core/language-changer",
    templateHtml = languageChangerHtmlTemplate,
    templateStyleUrls = [languageChangerCssTemplate],
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
        console.log("Initial setup for app-language-changer failed!");
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

    const element = this.shadowRoot.querySelector("#language-changer");
    if (element) {
      element.remove();
    }

    let languageChanger = document.createElement("div");
    languageChanger.classList.add("language-changer");
    languageChanger.setAttribute("id", "language-changer");
    languageChanger.innerHTML = "";

    this.shadowRoot.appendChild(languageChanger);

    return languageChanger;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#language-changer-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  // there can be other element methods and properties
  render() {
    this.props = getComponentProps.call(this, this.props);
    const languageChanger = this.getElement();

    if (languageChanger && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the languageChanger element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "color") {
            const color_changer = this.shadowRoot.getElementById("language-changer-input");
            color_changer.value = window.HSLToHex(getComputedStyle(document.documentElement, null).getPropertyValue("--color-primary"));
          } else if (key === "id") {
            languageChanger.setAttribute(`${key}`, value);
          }
        }
      });

      // Render children
      languageChanger.innerHTML = ""; // Clear existing content
      languageChanger.appendChild(itemTemplate);
    }
  }
}

customElements.define("app-language-changer", AppLanguageChanger);
