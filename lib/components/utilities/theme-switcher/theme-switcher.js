/**
 * Theme Switcher Component - Provides UI for toggling between light and dark themes
 * Using the BaseComponent architecture for consistency and improved functionality
 */
import { BaseComponent } from "../../../utils/BaseComponent.js";
import { isEmptyValue } from "../../../utils/helper.js";
import themeSwitcherCssTemplate from "./theme-switcher.css";
import themeSwitcherHtmlTemplate from "./theme-switcher.html";

// Centralize configuration constants
const THEME_SWITCHER_CONFIG = {
  APPEARANCES: ["primary", "secondary", "tertiary"],
  SIZES: ["xs", "s", "m", "l", "xl"],
  SHAPES: ["rounded", "curved", "rectangle"],
};

export class AppThemeSwitcherComponent extends BaseComponent {
  constructor(
    props = {
      id: "theme-switcher",
      appearance: "primary",
      size: "m",
      shape: "rounded",
      style: "",
      disabled: false,
    },
    basePath = "/components/utilities/theme-switcher",
  ) {
    super();

    // Template properties
    this.templateHtml = themeSwitcherHtmlTemplate;
    this.templateStyles = [themeSwitcherCssTemplate];

    // Component state
    this._state = {
      id: "theme-switcher",
      appearance: "primary",
      size: "m",
      shape: "rounded",
      style: "",
      disabled: false,
    };

    // Bound event handlers
    this._boundHandleThemeToggle = this.handleThemeToggle.bind(this);
    this._boundHandleSystemThemeChange = this.handleSystemThemeChange.bind(this);

    // For backward compatibility
    this.props = props;
    this.basePath = basePath;
  }

  /**
   * Observed attributes for automatic change handling
   */
  static get observedAttributes() {
    return ["id", "appearance", "size", "shape", "style", "disabled"];
  }

  /**
   * Handle attribute changes
   * @override
   */
  _handleAttributeChange(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    // Update both props (for backward compatibility) and _state
    this.props[name] = newValue;

    // Special handling for boolean values
    if (name === "disabled") {
      this._state[name] = newValue === "true" || newValue === true;
    } else {
      this._state[name] = newValue;
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
    const switchInput = this.shadowRoot?.querySelector("#theme-switcher-input");
    if (switchInput) {
      switchInput.addEventListener("change", this._boundHandleThemeToggle);
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", this._boundHandleSystemThemeChange);

    // Initialize the theme state
    this.syncThemeState();
  }

  /**
   * Clean up event listeners when component is disconnected
   * @override
   */
  _disconnectedCallback() {
    const switchInput = this.shadowRoot?.querySelector("#theme-switcher-input");
    if (switchInput) {
      switchInput.removeEventListener("change", this._boundHandleThemeToggle);
    }

    window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", this._boundHandleSystemThemeChange);
  }

  /**
   * Handle theme toggle event
   * @param {Event} event - The change event from the checkbox
   */
  handleThemeToggle(event) {
    if (this._state.disabled) {
      event.preventDefault();
      return;
    }

    const theme = event.target.checked ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);

    this.dispatchEvent(
      new CustomEvent("themeChange", {
        detail: { theme },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Handle system theme change event
   * @param {MediaQueryListEvent} event - The system theme change event
   */
  handleSystemThemeChange(event) {
    if (!localStorage.getItem("theme")) {
      const theme = event.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme);
      this.syncThemeState();
    }
  }

  /**
   * Synchronize the UI state with the current theme
   */
  syncThemeState() {
    const theme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    const switchInput = this.shadowRoot?.querySelector("#theme-switcher-input");
    if (switchInput) {
      switchInput.checked = theme === "dark";
    }
    document.documentElement.setAttribute("data-theme", theme);
  }

  /**
   * Render the component
   * @override
   */
  _render() {
    if (!this.shadowRoot) return;

    // Get or create the main container element
    let container = this.shadowRoot.querySelector(".theme-switcher");
    if (!container) {
      container = document.createElement("div");
      container.classList.add("theme-switcher");
      container.setAttribute("id", this._state.id || "theme-switcher");
      this.shadowRoot.appendChild(container);
    }

    // Clear existing content
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Apply data attributes
    for (const [key, value] of Object.entries(this._state)) {
      if (!isEmptyValue(value)) {
        if (key === "disabled") {
          container.toggleAttribute("disabled", value);
        } else if (["id", "style"].includes(key)) {
          container.setAttribute(key, value);
        } else {
          container.setAttribute(`data-${key}`, value);
        }
      }
    }

    // Get the template from the shadow DOM
    const template = this.shadowRoot.querySelector("#theme-switcher-template");
    if (!template) {
      console.error("Theme switcher template not found in shadow DOM");
      return;
    }

    // Clone the template
    const fragment = template.content.cloneNode(true);

    // Set disabled state on the input if needed
    const input = fragment.querySelector("#theme-switcher-input");
    if (input && this._state.disabled) {
      input.disabled = true;
    }

    // Add the fragment to the container
    container.appendChild(fragment);

    // Sync the theme state after rendering
    setTimeout(() => {
      this.syncThemeState();
    }, 0);
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
  setupEventListeners() {
    this._setupEventListeners();
  }

  /**
   * For backward compatibility
   */
  removeEventListeners() {
    this._disconnectedCallback();
  }

  /**
   * For backward compatibility
   */
  getElement() {
    if (!this.shadowRoot) {
      return null;
    }
    return this.shadowRoot.querySelector(".theme-switcher");
  }

  /**
   * For backward compatibility
   */
  getTemplate() {
    return this.shadowRoot.querySelector("#theme-switcher-template");
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
  customElements.define("app-theme-switcher", AppThemeSwitcherComponent);
  console.log("Theme Switcher component registered successfully");
} catch (error) {
  console.warn("Theme Switcher component registration issue:", error.message);
}
