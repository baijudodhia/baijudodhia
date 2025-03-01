// BaseComponent.js - A foundation class for all web components

import { isEmptyValue } from "./helper.js";

/**
 * BaseComponent - A foundation class for all web components
 * Provides common functionality like template loading, attribute handling, and lifecycle methods
 */
export class BaseComponent extends HTMLElement {
  constructor() {
    super();

    // Template properties
    this.template = null;
    this.templateHtml = null;
    this.templateUrl = null;
    this.templateStyleUrls = [];
    this.templateStyles = [];

    // Component state
    this._state = {};
    this._initialized = false;

    // Cache for templates and styles
    this._templateCache = {};
    this._styleCache = {};
  }

  /**
   * Standard lifecycle callbacks
   */
  connectedCallback() {
    if (!this._initialized) {
      this._initialize();
    }
  }

  disconnectedCallback() {
    // Cleanup resources when component is removed
    this._cleanup();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this._handleAttributeChange(name, oldValue, newValue);
    }
  }

  /**
   * Initialize the component
   * @private
   */
  async _initialize() {
    try {
      await this._loadTemplate();
      this._setupShadowDOM();
      this._loadStyles();
      this._parseAttributes();
      this._render();
      this._setupEventListeners();
      this._initialized = true;

      // Call component-specific initialization
      if (typeof this.onInit === "function") {
        this.onInit();
      }
    } catch (error) {
      console.error(`Error initializing component ${this.tagName}:`, error);
    }
  }

  /**
   * Load the component template
   * @private
   */
  async _loadTemplate() {
    if (!this.template) {
      this.template = document.createElement("template");
    }

    if (this.templateHtml) {
      // If templateHtml is a string that includes a <template> tag, extract its content
      if (typeof this.templateHtml === "string" && this.templateHtml.trim().startsWith("<template")) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.templateHtml, "text/html");
        const templateElement = doc.querySelector("template");

        if (templateElement) {
          this.template.content = templateElement.content.cloneNode(true);
        } else {
          // Fallback to direct assignment if parsing fails
          this.template.innerHTML = this.templateHtml;
        }
      } else {
        // Direct assignment for strings without a template tag
        this.template.innerHTML = this.templateHtml;
      }
    } else if (this.templateUrl) {
      // Load template from URL
      const cdn_domain = localStorage.getItem("cdn_domain");
      const origin = window.location.origin;

      let finalUrl = this.templateUrl;
      if (cdn_domain && !this.templateUrl.includes("http") && !origin.includes("localhost") && !origin.includes("127.0.0.1") && !origin.includes("http")) {
        finalUrl = `${cdn_domain}${this.templateUrl}`;
      }

      try {
        // Check cache first
        if (!this._templateCache[finalUrl]) {
          const response = await fetch(finalUrl);
          const html = await response.text();
          this._templateCache[finalUrl] = html;
        }

        this.template.innerHTML = this._templateCache[finalUrl];
      } catch (error) {
        console.error("Error loading template:", error);
        throw error;
      }
    } else {
      console.warn(`Component ${this.tagName} has no template defined`);
    }
  }

  /**
   * Set up the shadow DOM
   * @private
   */
  _setupShadowDOM() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }

    // Clear any existing content
    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild);
    }

    // Add the template content
    if (this.template && this.template.content) {
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    }
  }

  /**
   * Load component styles
   * @private
   */
  async _loadStyles() {
    // Add inline styles
    if (this.templateStyles && this.templateStyles.length > 0) {
      this.templateStyles.forEach((styleText) => {
        if (!styleText) {
          console.warn(`Component ${this.tagName} has an empty style defined`);
          return;
        }

        const style = document.createElement("style");
        try {
          // Handle both string and CSSStyleSheet objects
          if (typeof styleText === "string") {
            style.textContent = styleText;
          } else if (styleText instanceof CSSStyleSheet) {
            style.textContent = Array.from(styleText.cssRules)
              .map((rule) => rule.cssText)
              .join("\n");
          } else if (styleText.toString) {
            style.textContent = styleText.toString();
          }

          this.shadowRoot.appendChild(style);
        } catch (error) {
          console.error(`Error applying style to ${this.tagName}:`, error);
        }
      });
    }

    // Add external stylesheets
    if (this.templateStyleUrls && this.templateStyleUrls.length > 0) {
      const cdn_domain = localStorage.getItem("cdn_domain");
      const origin = window.location.origin;

      for (const styleUrl of this.templateStyleUrls) {
        let finalUrl = styleUrl;

        if (cdn_domain && !styleUrl.includes("http") && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
          finalUrl = `${cdn_domain}${styleUrl}`;
        }

        try {
          // Check cache first
          if (!this._styleCache[finalUrl]) {
            const response = await fetch(finalUrl);
            const cssText = await response.text();
            this._styleCache[finalUrl] = cssText;

            const style = document.createElement("style");
            style.textContent = cssText;
            this.shadowRoot.appendChild(style);
          } else {
            const style = document.createElement("style");
            style.textContent = this._styleCache[finalUrl];
            this.shadowRoot.appendChild(style);
          }
        } catch (error) {
          console.error(`Error loading style ${finalUrl}:`, error);
        }
      }
    }
  }

  /**
   * Parse component attributes
   * @private
   */
  _parseAttributes() {
    // Override in component subclasses
  }

  /**
   * Render the component
   * @private
   */
  _render() {
    // Override in component subclasses
  }

  /**
   * Set up event listeners
   * @private
   */
  _setupEventListeners() {
    // Override in component subclasses
  }

  /**
   * Handle attribute changes
   * @private
   */
  _handleAttributeChange(name, oldValue, newValue) {
    // Override in component subclasses
  }

  /**
   * Clean up resources
   * @private
   */
  _cleanup() {
    // Override in component subclasses
  }

  /**
   * Update component state and trigger re-render
   * @param {Object} newState - New state object to merge with existing state
   * @param {boolean} shouldRender - Whether to trigger a re-render
   */
  setState(newState, shouldRender = true) {
    this._state = { ...this._state, ...newState };

    if (shouldRender) {
      this._render();
    }
  }

  /**
   * Get current component state
   * @returns {Object} Current state
   */
  getState() {
    return { ...this._state };
  }

  /**
   * Helper to query elements in the shadow DOM
   * @param {string} selector - CSS selector
   * @returns {Element} The first matching element
   */
  $(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  /**
   * Helper to query all matching elements in the shadow DOM
   * @param {string} selector - CSS selector
   * @returns {NodeList} All matching elements
   */
  $$(selector) {
    return this.shadowRoot.querySelectorAll(selector);
  }

  /**
   * Dispatch a custom event
   * @param {string} name - Event name
   * @param {Object} detail - Event detail object
   * @param {Object} options - Event options
   */
  emit(name, detail = {}, options = {}) {
    const event = new CustomEvent(name, {
      bubbles: true,
      composed: true,
      cancelable: true,
      ...options,
      detail,
    });

    this.dispatchEvent(event);
    return event;
  }
}
