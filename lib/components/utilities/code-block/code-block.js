/**
 * Code Block Component - Displays code with syntax highlighting and copy functionality
 * Using the BaseComponent architecture for consistency and improved functionality
 */
import { BaseComponent } from "../../../utils/BaseComponent.js";
import { isEmptyValue } from "../../../utils/helper.js";
import codeBlockCssTemplate from "./code-block.css";
import codeBlockHtmlTemplate from "./code-block.html";

// Centralize configuration constants
const CODE_BLOCK_CONFIG = {
  APPEARANCES: ["primary", "secondary", "tertiary"],
  SIZES: ["xs", "s", "m", "l", "xl"],
  SHAPES: ["rounded", "curved", "rectangle"],
};

/**
 * Load highlight.js dependency for syntax highlighting
 * @returns {Promise<Object>} - Highlight.js instance
 */
const loadDependencies = async () => {
  try {
    await new Promise((resolve, reject) => {
      if (window.hljs) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return window.hljs;
  } catch (error) {
    console.error("Failed to load highlight.js:", error);
    return null;
  }
};

export class AppCodeBlockComponent extends BaseComponent {
  constructor(
    props = {
      id: "code-block",
      appearance: "primary",
      size: "m",
      shape: "curved",
      style: "",
      title: "",
      code: "",
      language: "plaintext",
    },
    basePath = "/components/utilities/code-block",
  ) {
    super();

    // Template properties
    this.templateHtml = codeBlockHtmlTemplate;
    this.templateStyles = [codeBlockCssTemplate];

    // Component state
    this._state = {
      id: "code-block",
      appearance: "primary",
      size: "m",
      shape: "curved",
      style: "",
      title: "",
      code: "",
      language: "plaintext",
    };

    // External dependencies
    this.hljs = null;

    // Bound event handlers
    this._boundHandleCopyClick = this._handleCopyClick.bind(this);

    // For backward compatibility
    this.props = props;
    this.basePath = basePath;

    // Initialize the component
    this._init();
  }

  /**
   * Initialize the component by loading dependencies
   * @private
   */
  async _init() {
    try {
      this.hljs = await loadDependencies();

      // Apply the current component state and render
      this._parseAttributes();
      this._render();
      this._setupEventListeners();
    } catch (error) {
      console.error("Failed to initialize code block component:", error);
    }
  }

  /**
   * Observed attributes for automatic change handling
   */
  static get observedAttributes() {
    return ["id", "appearance", "size", "shape", "style", "title", "code", "language"];
  }

  /**
   * Handle attribute changes
   * @override
   * @param {string} name - Attribute name
   * @param {string} oldValue - Old attribute value
   * @param {string} newValue - New attribute value
   */
  _handleAttributeChange(name, oldValue, newValue) {
    if (oldValue === newValue || !newValue) return;

    // Update both props (for backward compatibility) and _state
    this.props[name] = newValue;
    this._state[name] = newValue;

    // Only render if highlight.js is loaded
    if (this.hljs) {
      this._render();
    }
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

        // Update both props (for backward compatibility) and _state
        this.props[attr] = value;
        this._state[attr] = value;
      }
    });
  }

  /**
   * Set up event listeners for the component
   * @override
   */
  _setupEventListeners() {
    const copyBtn = this.shadowRoot?.querySelector("app-button");
    if (copyBtn) {
      copyBtn.addEventListener("click", this._boundHandleCopyClick);
    }
  }

  /**
   * Clean up event listeners when component is disconnected
   * @override
   */
  _disconnectedCallback() {
    const copyBtn = this.shadowRoot?.querySelector("app-button");
    if (copyBtn) {
      copyBtn.removeEventListener("click", this._boundHandleCopyClick);
    }
  }

  /**
   * Handle copy button click
   * @private
   * @param {Event} event - Click event
   */
  async _handleCopyClick(event) {
    try {
      const code = this._state.code;
      await navigator.clipboard.writeText(code);

      const copyBtn = event.currentTarget;
      copyBtn.setAttribute("icon-right", "fa fa-check");
      copyBtn.setAttribute("disabled", "true");

      setTimeout(() => {
        copyBtn.setAttribute("icon-right", "fa fa-copy");
        copyBtn.setAttribute("disabled", "false");
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  }

  /**
   * Get appropriate button size based on code block size
   * @private
   * @param {string} propSize - Code block size
   * @returns {string} - Button size
   */
  _getButtonSize(propSize) {
    switch (propSize) {
      case "xxs":
        return "xs";
      case "xs":
        return "xs";
      case "s":
        return "xs";
      case "m":
        return "s";
      case "l":
        return "m";
      case "xl":
        return "l";
      case "xxl":
        return "xl";
      default:
        return "s";
    }
  }

  /**
   * Render the component
   * @override
   */
  _render() {
    if (!this.shadowRoot || !this.hljs) return;

    // Get or create the main container element
    let codeBlock = this.shadowRoot.querySelector(".code-block");
    if (!codeBlock) {
      codeBlock = document.createElement("div");
      codeBlock.classList.add("code-block");
      codeBlock.setAttribute("id", this._state.id || "code-block");
      this.shadowRoot.appendChild(codeBlock);
    }

    // Clear existing content
    while (codeBlock.firstChild) {
      codeBlock.removeChild(codeBlock.firstChild);
    }

    // Apply data attributes
    for (const [key, value] of Object.entries(this._state)) {
      if (!isEmptyValue(value)) {
        if (["id", "style"].includes(key)) {
          codeBlock.setAttribute(key, value);
        } else if (!["code", "language", "title"].includes(key)) {
          codeBlock.setAttribute(`data-${key}`, value);
        }
      }
    }

    // Get the template from the shadow DOM
    const template = this.shadowRoot.querySelector("#code-block-template");
    if (!template) {
      console.error("Code block template not found in shadow DOM");
      return;
    }

    // Clone the template
    const fragment = template.content.cloneNode(true);

    // Set title
    if (this._state.title) {
      const titleEl = fragment.querySelector("#code-title");
      if (titleEl) {
        titleEl.textContent = this._state.title;
        titleEl.setAttribute("title", this._state.title);
      }
    }

    // Configure the copy button
    const copyBtn = fragment.querySelector("app-button");
    if (copyBtn) {
      copyBtn.setAttribute("appearance", this._state.appearance || "primary");
      copyBtn.setAttribute("size", this._getButtonSize(this._state.size) || "s");
      copyBtn.setAttribute("shape", this._state.shape || "curved");
    }

    // Set and highlight code
    if (this._state.code) {
      const codeEl = fragment.querySelector("code");
      if (codeEl) {
        codeEl.textContent = this._state.code;
        codeEl.className = `language-${this._state.language || "plaintext"}`;

        // Add the fragment to the container first, then highlight
        codeBlock.appendChild(fragment);

        // Now highlight the code
        this.hljs.highlightElement(codeEl);
        return; // Return here since we've already added the fragment
      }
    }

    // Add the fragment to the container if not already added
    codeBlock.appendChild(fragment);
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
  setupCopyButton() {
    this._setupEventListeners();
  }

  /**
   * For backward compatibility
   */
  getElement() {
    if (!this.shadowRoot) return null;
    return this.shadowRoot.querySelector(".code-block");
  }

  /**
   * For backward compatibility
   */
  getTemplate() {
    return this.shadowRoot.querySelector("#code-block-template");
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
  customElements.define("app-code-block", AppCodeBlockComponent);
  console.log("Code Block component registered successfully");
} catch (error) {
  console.warn("Code Block component registration issue:", error.message);
}
