/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import cardCssTemplate from "./card.css";
import cardHtmlTemplate from "./card.html";

// Centralize configuration constants
const CARD_CONFIG = {
  APPEARANCES: ["primary", "secondary", "tertiary"],
  SIZES: ["xs", "s", "m", "l", "xl"],
  SHAPES: ["rounded", "curved", "rectangle"],
};

export class AppCardComponent extends HTMLElement {
  constructor(
    props = {
      id: "card",
      appearance: "primary",
      size: "m",
      shape: "curved",
      style: "",
      header: "",
      body: "",
      footer: "",
    },
    basePath = "/components/base/card",
    templateHtml = cardHtmlTemplate,
    templateStyleUrls = [cardCssTemplate],
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
        console.info("Initial setup for app-card failed!");
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
    return ["id", "appearance", "size", "shape", "style", "header", "body", "footer"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && newValue) {
      this.props[name] = newValue;
      this.render();
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

    const element = this.shadowRoot.querySelector(`#${this.props.id}` || "#cards");
    if (element) {
      element.remove();
    }

    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("id", `${this.props.id}` || "cards");
    card.innerHTML = "";

    this.shadowRoot.appendChild(card);

    return card;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#card-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  render() {
    this.props = getComponentProps.call(this, this.props);
    const card = this.getElement();

    if (!card || !("content" in document.createElement("template"))) {
      return;
    }

    const itemTemplate = this.getTemplateClone(this.getTemplate());

    // Apply attributes and content
    Object.keys(this.props).forEach((key) => {
      const value = this.props[key];

      if (!isEmptyValue(value)) {
        switch (key) {
          case "id":
          case "style":
            card.setAttribute(key, value);
            break;
          case "header":
            const headerEl = itemTemplate.querySelector("#card-header");
            headerEl.innerHTML = value;
            break;
          case "body":
            const bodyEl = itemTemplate.querySelector("#card-body");
            bodyEl.innerHTML = value;
            break;
          case "footer":
            const footerEl = itemTemplate.querySelector("#card-footer");
            footerEl.innerHTML = value;
            break;
          default:
            card.setAttribute(`data-${key}`, value);
            break;
        }
      } else {
        // Remove empty sections
        const sectionElement = itemTemplate.querySelector(`#card-${key}`);
        if (sectionElement) {
          sectionElement.remove();
        }
      }
    });

    // Update the DOM
    card.innerHTML = "";
    card.appendChild(itemTemplate);
  }
}

customElements.define("app-card", AppCardComponent);
