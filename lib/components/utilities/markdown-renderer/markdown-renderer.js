/**
 * Markdown Renderer Component - Renders markdown content with MathJax support
 * Using the BaseComponent architecture for consistency and improved functionality
 */
import { BaseComponent } from "../../../utils/BaseComponent.js";
import { isEmptyValue } from "../../../utils/helper.js";
import markdownRendererCssTemplate from "./markdown-renderer.css";
import markdownRendererHtmlTemplate from "./markdown-renderer.html";

// Centralize configuration constants
const MARKDOWN_RENDERER_CONFIG = {
  APPEARANCES: ["primary", "secondary", "tertiary"],
  SIZES: ["xs", "s", "m", "l", "xl"],
  SHAPES: ["rounded", "curved", "rectangle"],
};

/**
 * Load Marked.js and MathJax dependencies
 * @param {Object} props - Component properties
 * @returns {Promise<Object>} - Loaded dependencies
 */
const loadDependencies = async (props) => {
  try {
    // Load Marked.js
    await new Promise((resolve, reject) => {
      if (window.marked) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.2/marked.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    // Load MathJax
    await new Promise((resolve, reject) => {
      if (window.MathJax) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/mathjax@2.7.9/MathJax.js?config=TeX-MML-AM_CHTML";
      script.onload = () => {
        window.MathJax.Hub.Config({
          tex2jax: {
            inlineMath: [
              ["$", "$"],
              ["\\(", "\\)"],
            ],
            displayMath: [
              ["$$", "$$"],
              ["\\[", "\\]"],
            ],
            processEscapes: true,
          },
          jax: ["input/TeX", "output/HTML-CSS", "output/SVG"], // Specify the input and output formats
          extensions: ["tex2jax.js", "AMSsymbols.js", "autoload.js"], // Load some useful extensions
          "HTML-CSS": {
            availableFonts: ["TeX", "STIX"], // Specify which fonts to use for rendering math
          },
          messageStyle: "none", // Suppress startup messages
        });
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    // Marked.js renderer to handle code blocks
    const renderer = new window.marked.Renderer();
    renderer.code = function (code, language, escaped) {
      const codeBlock = document.createElement("app-code-block");
      codeBlock.setAttribute("code", code);
      if (language) {
        codeBlock.setAttribute("language", language);
        codeBlock.setAttribute("title", language);
      }
      codeBlock.setAttribute("appearance", props?.appearance || "primary");
      codeBlock.setAttribute("size", props?.size || "m");
      codeBlock.setAttribute("shape", props?.shape || "curved");
      return codeBlock.outerHTML;
    };

    window.marked.setOptions({
      gfm: true,
      breaks: true,
      headerIds: true,
      headerPrefix: "heading-",
      mangle: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: true,
      renderer: renderer,
    });

    return { marked: window.marked, MathJax: window.MathJax };
  } catch (error) {
    console.error("Failed to load dependencies:", error);
    return null;
  }
};

export class AppMarkdownRendererComponent extends BaseComponent {
  constructor(
    props = {
      id: "markdown-renderer",
      appearance: "primary",
      size: "m",
      shape: "curved",
      style: "",
      content: "",
    },
    basePath = "/components/utilities/markdown-renderer",
  ) {
    super();

    // Template properties
    this.templateHtml = markdownRendererHtmlTemplate;
    this.templateStyles = [markdownRendererCssTemplate];

    // Component state
    this._state = {
      id: "markdown-renderer",
      appearance: "primary",
      size: "m",
      shape: "curved",
      style: "",
      content: "",
    };

    // External dependencies
    this.marked = null;
    this.MathJax = null;

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
      const deps = await loadDependencies(this._state);
      if (deps) {
        this.marked = deps.marked;
        this.MathJax = deps.MathJax;

        // Apply the current component state and render
        this._parseAttributes();
        this._render();
      }
    } catch (error) {
      console.error("Failed to initialize markdown renderer:", error);
    }
  }

  /**
   * Observed attributes for automatic change handling
   */
  static get observedAttributes() {
    return ["id", "appearance", "size", "shape", "style", "content"];
  }

  /**
   * Handle attribute changes
   * @override
   * @param {string} name - Attribute name
   * @param {string} oldValue - Old attribute value
   * @param {string} newValue - New attribute value
   */
  _handleAttributeChange(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    // Update both props (for backward compatibility) and _state
    this.props[name] = newValue;
    this._state[name] = newValue;

    // Only render if dependencies are loaded
    if (this.marked && this.MathJax) {
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
   * Render the component
   * @override
   */
  _render() {
    if (!this.shadowRoot || !this.marked || !this.MathJax) return;

    // Get or create the main container element
    let container = this.shadowRoot.querySelector(".markdown-renderer");
    if (!container) {
      container = document.createElement("div");
      container.classList.add("markdown-renderer");
      container.setAttribute("id", this._state.id || "markdown-renderer");
      this.shadowRoot.appendChild(container);
    }

    // Clear existing content
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Apply data attributes
    for (const [key, value] of Object.entries(this._state)) {
      if (!isEmptyValue(value)) {
        if (["id", "style"].includes(key)) {
          container.setAttribute(key, value);
        } else if (key !== "content") {
          container.setAttribute(`data-${key}`, value);
        }
      }
    }

    // Get the template from the shadow DOM
    const template = this.shadowRoot.querySelector("#markdown-renderer-template");
    if (!template) {
      console.error("Markdown renderer template not found in shadow DOM");
      return;
    }

    // Clone the template
    const fragment = template.content.cloneNode(true);

    // Render markdown content
    const contentEl = fragment.querySelector("#markdown-content");
    if (contentEl && this._state.content) {
      // Render Markdown content using Marked.js
      contentEl.innerHTML = this.marked.parse(this._state.content);

      // Make sure MathJax finishes processing the content after it's rendered
      this.MathJax.Hub.Queue(["Typeset", this.MathJax.Hub, contentEl]);
    }

    // Add the fragment to the container
    container.appendChild(fragment);
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
    if (!this.shadowRoot) return null;
    return this.shadowRoot.querySelector(".markdown-renderer");
  }

  /**
   * For backward compatibility
   */
  getTemplate() {
    return this.shadowRoot.querySelector("#markdown-renderer-template");
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
  customElements.define("app-markdown-renderer", AppMarkdownRendererComponent);
  console.log("Markdown Renderer component registered successfully");
} catch (error) {
  console.warn("Markdown Renderer component registration issue:", error.message);
}
