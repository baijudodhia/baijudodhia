/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import cardCssTemplate from "./card.css";
import cardHtmlTemplate from "./card.html";

class AppCardComponent extends HTMLElement {
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

    const element = this.shadowRoot.querySelector("#card");
    if (element) {
      element.remove();
    }

    let card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("id", "card");
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
    const card = this.getElement(this.props.type);

    if (card && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the card element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          switch (key) {
            case "id":
              break;
            case "header":
              const cardHeaderClone = itemTemplate.querySelector("#card-header");
              cardHeaderClone.innerHTML = value;
              break;
            case "body":
              const cardBodyClone = itemTemplate.querySelector("#card-body");
              cardBodyClone.innerHTML = value;
              break;
            case "footer":
              const cardFooterClone = itemTemplate.querySelector("#card-footer");
              cardFooterClone.innerHTML = value;
              break;
            default:
              card.setAttribute(`data-${key}`, value);
              break;
          }
        } else {
          // Remove specific elements from the template if the value is empty
          switch (key) {
            case "header":
              itemTemplate.querySelector(`#card-${key}`).remove();
              break;
            case "body":
              itemTemplate.querySelector(`#card-${key}`).remove();
              break;
            case "footer":
              itemTemplate.querySelector(`#card-${key}`).remove();
              break;
            default:
              break;
          }
        }
      });

      // Render children
      card.innerHTML = ""; // Clear existing content
      card.appendChild(itemTemplate);
    }
  }
}

customElements.define("app-card", AppCardComponent);
