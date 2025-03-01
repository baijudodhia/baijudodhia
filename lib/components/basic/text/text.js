/**
 * Text Component - A versatile text component with various appearances, sizes, and states
 * Using the BaseComponent architecture for consistency and improved functionality
 */
import { BaseComponent } from "../../../utils/BaseComponent.js";
import { isEmptyValue } from "../../../utils/helper.js";
import textCssTemplate from "./text.css";
import textHtmlTemplate from "./text.html";

// Centralize configuration constants
const TEXT_CONFIG = {
  APPEARANCES: ["primary", "secondary", "tertiary", "link"],
  SIZES: ["xs", "s", "m", "l", "xl", "xxl", "xxxl"],
  VARIANTS: ["text", "link", "heading", "paragraph"],
};

export class AppTextComponent extends BaseComponent {
  constructor(
    props = {
      id: "text",
      appearance: "",
      size: "m",
      style: "",
      text: "",
      title: "",
      "icon-left": "",
      "icon-right": "",
      href: "",
      "href-target": "_blank",
      variant: "text",
    },
    basePath = "/components/base/text",
  ) {
    super();

    // Template properties
    this.templateHtml = textHtmlTemplate;
    this.templateStyles = [textCssTemplate];

    // Component state
    this._state = {
      id: "text",
      appearance: "",
      size: "m",
      style: "",
      text: "",
      title: "",
      iconLeft: "",
      iconRight: "",
      iconElementLeft: "",
      iconElementRight: "",
      href: "",
      hrefTarget: "_blank",
      variant: "text",
      loading: false,
    };

    // For backward compatibility
    this.props = props;
    this.basePath = basePath;
  }

  /**
   * Observed attributes for automatic change handling
   */
  static get observedAttributes() {
    return ["id", "appearance", "size", "style", "text", "title", "icon-left", "icon-right", "icon-element-left", "icon-element-right", "variant", "href", "href-target", "loading"];
  }

  /**
   * Handle attribute changes
   * @override
   */
  _handleAttributeChange(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    // Update both props (for backward compatibility) and _state
    this.props[name] = newValue;

    // Map kebab-case attributes to camelCase state properties
    switch (name) {
      case "icon-left":
        this._state.iconLeft = newValue;
        break;
      case "icon-right":
        this._state.iconRight = newValue;
        break;
      case "icon-element-left":
        this._state.iconElementLeft = newValue;
        break;
      case "icon-element-right":
        this._state.iconElementRight = newValue;
        break;
      case "href-target":
        this._state.hrefTarget = newValue;
        break;
      default:
        this._state[name] = newValue;
    }

    // If href is set, automatically set variant to link
    if (name === "href" && newValue && !this._state.variant) {
      this._state.variant = "link";
      this.props.variant = "link";
    }

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
    if (this._state.variant === "link" && this._state.href) {
      // Add click listener for link variant
      this.addEventListener("click", this._handleLinkClick.bind(this));

      // Add keyboard listener for accessibility
      this.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this._handleLinkClick();
        }
      });

      // Set role and tabindex for accessibility
      this.setAttribute("role", "link");
      if (!this.hasAttribute("tabindex")) {
        this.setAttribute("tabindex", "0");
      }
    }
  }

  /**
   * Handle clicks for link variant
   * @private
   */
  _handleLinkClick() {
    if (!this._state.href) return;

    const target = this._state.hrefTarget || "_blank";

    if (target === "_blank") {
      // Open in new window with security best practices
      const newWindow = window.open(this._state.href, target, "noopener,noreferrer");
      if (newWindow) {
        newWindow.opener = null;
        newWindow.location = this._state.href;
      } else {
        console.error("Failed to open new window.");
      }
    } else {
      // Open in the same window
      window.location.href = this._state.href;
    }
  }

  /**
   * Render the component
   * @override
   */
  _render() {
    if (!this.shadowRoot) return;

    // Get or create the main text element
    let textElement = this.shadowRoot.querySelector(".text");
    if (!textElement) {
      textElement = document.createElement("div");
      textElement.classList.add("text");
      textElement.setAttribute("id", this._state.id || "text");
      this.shadowRoot.appendChild(textElement);
    }

    // Clear existing content
    while (textElement.firstChild) {
      textElement.removeChild(textElement.firstChild);
    }

    // Apply data attributes
    textElement.setAttribute("data-appearance", this._state.appearance || "");
    textElement.setAttribute("data-size", this._state.size || "m");
    textElement.setAttribute("data-variant", this._state.variant || "text");

    // Apply inline styles if present
    if (this._state.style) {
      textElement.setAttribute("style", this._state.style);
    }

    // Handle loading state
    if (this._state.loading === "true" || this._state.loading === true) {
      const loadingAnimationContainer = document.createElement("div");
      loadingAnimationContainer.setAttribute("id", "loader-container");

      const loadingAnimation = document.createElement("div");
      loadingAnimation.setAttribute("id", "loader");
      loadingAnimation.setAttribute("data-appearance", this._state.appearance);
      loadingAnimation.setAttribute("data-size", this._state.size);
      loadingAnimation.setAttribute("disabled", true);

      loadingAnimationContainer.appendChild(loadingAnimation);
      textElement.appendChild(loadingAnimationContainer);
      return;
    }

    // Get the template from the shadow DOM
    const template = this.shadowRoot.querySelector("#text-template");
    if (!template) {
      console.error("Text template not found in shadow DOM");
      return;
    }

    // Clone the template
    const fragment = template.content.cloneNode(true);

    // Process left icon
    const leftIconEl = fragment.querySelector("#text-icon-left");
    if (this._state.iconLeft && leftIconEl) {
      this._state.iconLeft.split(" ").forEach((cls) => {
        leftIconEl.classList.add(cls);
      });
    } else if (this._state.iconElementLeft) {
      // Support for custom icon element
      try {
        const tempEl = document.createElement("div");
        tempEl.innerHTML = this._state.iconElementLeft.trim();
        if (leftIconEl && leftIconEl.parentNode) {
          leftIconEl.parentNode.replaceChild(tempEl.firstChild, leftIconEl);
        }
      } catch (error) {
        console.error("Failed to parse left icon element:", error);
      }
    } else if (leftIconEl) {
      leftIconEl.remove();
    }

    // Process text content
    const textContentEl = fragment.querySelector("#text-text");
    if (textContentEl) {
      if (this._state.text) {
        textContentEl.textContent = this._state.text;
        textContentEl.setAttribute("title", this._state.title || this._state.text);
      } else {
        textContentEl.remove();
      }
    }

    // Process right icon
    const rightIconEl = fragment.querySelector("#text-icon-right");
    if (this._state.iconRight && rightIconEl) {
      this._state.iconRight.split(" ").forEach((cls) => {
        rightIconEl.classList.add(cls);
      });
    } else if (this._state.iconElementRight) {
      // Support for custom icon element
      try {
        const tempEl = document.createElement("div");
        tempEl.innerHTML = this._state.iconElementRight.trim();
        if (rightIconEl && rightIconEl.parentNode) {
          rightIconEl.parentNode.replaceChild(tempEl.firstChild, rightIconEl);
        }
      } catch (error) {
        console.error("Failed to parse right icon element:", error);
      }
    } else if (rightIconEl) {
      rightIconEl.remove();
    }

    // Add the fragment to the text element
    textElement.appendChild(fragment);

    // Handle variant-specific behavior
    if (this._state.variant === "link" && this._state.href) {
      textElement.classList.add("text-link");
      textElement.style.cursor = "pointer";
    }
  }

  /**
   * For backward compatibility
   */
  render() {
    this._render();
  }
}

// Register the component with improved error handling
try {
  customElements.define("app-text", AppTextComponent);
  console.log("Text component registered successfully");
} catch (error) {
  console.warn("Text component registration issue:", error.message);
}
