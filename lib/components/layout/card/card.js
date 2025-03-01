/**
 * Card Component - A versatile card component with various appearances, sizes, and shapes
 * Using the BaseComponent architecture for consistency and improved functionality
 */
import { BaseComponent } from "../../../utils/BaseComponent.js";
import { isEmptyValue } from "../../../utils/helper.js";
import cardCssTemplate from "./card.css";
import cardHtmlTemplate from "./card.html";

// Centralize configuration constants
const CARD_CONFIG = {
  APPEARANCES: ["primary", "secondary", "tertiary"],
  SIZES: ["xs", "s", "m", "l", "xl"],
  SHAPES: ["rounded", "curved", "rectangle"],
};

export class AppCardComponent extends BaseComponent {
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
  ) {
    super();

    // Template properties
    this.templateHtml = cardHtmlTemplate;
    this.templateStyles = [cardCssTemplate];

    // Component state
    this._state = {
      id: "card",
      appearance: "primary",
      size: "m",
      shape: "curved",
      style: "",
      header: "",
      body: "",
      footer: "",
    };

    // For backward compatibility
    this.props = props;
    this.basePath = basePath;
  }

  /**
   * Observed attributes for automatic change handling
   */
  static get observedAttributes() {
    return ["id", "appearance", "size", "shape", "style", "header", "body", "footer"];
  }

  /**
   * Handle attribute changes
   * @override
   */
  _handleAttributeChange(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    // Update both props (for backward compatibility) and _state
    this.props[name] = newValue;
    this._state[name] = newValue;

    this._render();
  }

  /**
   * Parse attributes from the element
   * @override
   */
  _parseAttributes() {
    // Get all observed attributes
    const attributes = this.constructor.observedAttributes;

    // Process each attribute
    attributes.forEach((attr) => {
      if (this.hasAttribute(attr)) {
        const value = this.getAttribute(attr);
        this._handleAttributeChange(attr, null, value);
      }
    });
  }

  /**
   * Set up event listeners for the component
   * @override
   */
  _setupEventListeners() {
    // No specific event listeners needed for basic card functionality
  }

  /**
   * Render the component
   * @override
   */
  _render() {
    if (!this.shadowRoot) return;

    // Get or create the main card element
    let cardElement = this.shadowRoot.querySelector(".card");
    if (!cardElement) {
      cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.setAttribute("id", this._state.id || "card");
      this.shadowRoot.appendChild(cardElement);
    }

    // Clear existing content
    while (cardElement.firstChild) {
      cardElement.removeChild(cardElement.firstChild);
    }

    // Apply data attributes
    cardElement.setAttribute("data-appearance", this._state.appearance || "primary");
    cardElement.setAttribute("data-size", this._state.size || "m");
    cardElement.setAttribute("data-shape", this._state.shape || "curved");

    // Apply inline styles if present
    if (this._state.style) {
      cardElement.setAttribute("style", this._state.style);
    }

    // Get the template from the shadow DOM
    const template = this.shadowRoot.querySelector("#card-template");
    if (!template) {
      console.error("Card template not found in shadow DOM");
      return;
    }

    // Clone the template
    const fragment = template.content.cloneNode(true);

    // Process card sections
    const sections = ["header", "body", "footer"];
    sections.forEach((section) => {
      const sectionElement = fragment.querySelector(`#card-${section}`);
      if (sectionElement) {
        if (this._state[section]) {
          sectionElement.innerHTML = this._state[section];
        } else {
          // Remove empty sections
          sectionElement.remove();
        }
      }
    });

    // Add the fragment to the card element
    cardElement.appendChild(fragment);
  }

  /**
   * For backward compatibility
   */
  render() {
    this._render();
  }

  /**
   * For backward compatibility
   */
  getElement() {
    if (!this.shadowRoot) {
      return null;
    }
    return this.shadowRoot.querySelector(".card");
  }

  /**
   * For backward compatibility
   */
  getTemplate() {
    return this.shadowRoot.querySelector("#card-template");
  }

  /**
   * For backward compatibility
   */
  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }
}

// Register the component with improved error handling
try {
  customElements.define("app-card", AppCardComponent);
  console.log("Card component registered successfully");
} catch (error) {
  console.warn("Card component registration issue:", error.message);
}
