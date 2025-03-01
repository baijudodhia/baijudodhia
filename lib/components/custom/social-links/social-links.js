/**
 * Social Links Component - Displays a collection of social media links
 * Using the BaseComponent architecture for consistency and improved functionality
 */
import { BaseComponent } from "../../../utils/BaseComponent.js";
import { isEmptyValue } from "../../../utils/helper.js";
import socialLinksCssTemplate from "./social-links.css";
import socialLinksHtmlTemplate from "./social-links.html";

// Centralize configuration constants
const SOCIAL_LINKS_CONFIG = {
  APPEARANCES: ["primary", "secondary", "tertiary"],
  SIZES: ["xs", "s", "m", "l", "xl"],
  SHAPES: ["rounded", "curved", "rectangle"],
};

export class AppSocialLinksComponent extends BaseComponent {
  constructor(
    props = {
      id: "social-links",
      color: "",
      size: "m",
      shape: "curved",
      appearance: "primary",
      style: "",
    },
    basePath = "/components/custom/social-links",
  ) {
    super();

    // Template properties
    this.templateHtml = socialLinksHtmlTemplate;
    this.templateStyles = [socialLinksCssTemplate];

    // Component state
    this._state = {
      id: "social-links",
      color: "",
      size: "m",
      shape: "curved",
      appearance: "primary",
      style: "",
      // Social links state - will be set from attributes
      github: false,
      linkedin: false,
      blog: false,
      portfolio: false,
    };

    // For backward compatibility
    this.props = props;
    this.basePath = basePath;
  }

  /**
   * Component is connected to the DOM
   * @override
   */
  connectedCallback() {
    super.connectedCallback();

    // Initialize the component state from attributes
    this._parseAttributes();
    this._render();
  }

  /**
   * Observed attributes for automatic change handling
   */
  static get observedAttributes() {
    return ["id", "color", "size", "shape", "appearance", "style", "github", "linkedin", "blog", "portfolio"];
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

    // For boolean attributes (github, linkedin, blog, portfolio)
    if (["github", "linkedin", "blog", "portfolio"].includes(name)) {
      this._state[name] = this.hasAttribute(name);
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

        // For boolean attributes (github, linkedin, blog, portfolio)
        if (["github", "linkedin", "blog", "portfolio"].includes(attr)) {
          this._state[attr] = true;
          this.props[attr] = true;
        } else {
          // Update both props (for backward compatibility) and _state
          this.props[attr] = value;
          this._state[attr] = value;
        }
      }
    });
  }

  /**
   * Create a social link button
   * @param {string} icon - Font Awesome icon class
   * @param {string} iconTitle - Button tooltip
   * @param {string} title - Button label
   * @param {string} link - URL to navigate to
   * @returns {HTMLElement} - Button element
   */
  _createLink(icon, iconTitle, title, link) {
    const _app_link = document.createElement("app-button");
    _app_link.setAttribute("icon-left", icon);
    _app_link.setAttribute("label", title);
    _app_link.setAttribute("title", iconTitle);
    _app_link.setAttribute("type", "link");
    _app_link.setAttribute("href", link);
    _app_link.setAttribute("shape", this._state.shape || "curved");
    _app_link.setAttribute("size", this._state.size || "s");
    _app_link.setAttribute("style", this._state.style || "");
    _app_link.setAttribute("appearance", this._state.appearance || "primary");
    return _app_link;
  }

  /**
   * Render all available social links
   * @private
   * @param {HTMLElement} container - Container element for the links
   */
  _renderSocialLinks(container) {
    if (!container) return;

    // Clear existing content
    container.innerHTML = "";

    const utmSource = window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1") ? "baijudodhia.github.io" : window.location.hostname;

    // GitHub link
    if (this._state.github) {
      const _app_link_github = this._createLink("fab fa-github", "Check out projects on GitHub!", "GitHub", `https://github.com/baijudodhia/?utm_source=${utmSource}&utm_medium=website`);
      container.append(_app_link_github);
    }

    // LinkedIn link
    if (this._state.linkedin) {
      const _app_link_linkedin = this._createLink("fab fa-linkedin", "Connect with me on LinkedIn!", "LinkedIn", `https://www.linkedin.com/in/baijudodhia/?utm_source=${utmSource}&utm_medium=website`);
      container.append(_app_link_linkedin);
    }

    // Blog link
    if (this._state.blog) {
      const _app_link_blog = this._createLink("fas fa-rss", "Checkout my blog!", "Blog", `https://baijudodhia.blogspot.com/?utm_source=${utmSource}&utm_medium=website`);
      container.append(_app_link_blog);
    }

    // Portfolio link
    if (this._state.portfolio) {
      const _app_link_portfolio = this._createLink("fas fa-laptop-code", "Baiju Dodhia | Portfolio", "Portfolio", `https://baijudodhia.github.io/?utm_source=${utmSource}&utm_medium=website`);
      container.append(_app_link_portfolio);
    }
  }

  /**
   * Render the component
   * @override
   */
  _render() {
    if (!this.shadowRoot) return;

    // Get or create the main container element
    let socialLinks = this.shadowRoot.querySelector(".social-links");
    if (!socialLinks) {
      socialLinks = document.createElement("div");
      socialLinks.classList.add("social-links");
      socialLinks.setAttribute("id", this._state.id || "social-links");
      this.shadowRoot.appendChild(socialLinks);
    }

    // Apply data attributes
    for (const [key, value] of Object.entries(this._state)) {
      if (!isEmptyValue(value) && !["github", "linkedin", "blog", "portfolio"].includes(key)) {
        if (key === "id" || key === "style") {
          socialLinks.setAttribute(key, value);
        } else {
          socialLinks.setAttribute(`data-${key}`, value);
        }
      }
    }

    // Render social links
    this._renderSocialLinks(socialLinks);
  }

  /**
   * For backward compatibility
   */
  showLinks() {
    this._renderSocialLinks(this.shadowRoot?.querySelector(".social-links"));
  }

  /**
   * For backward compatibility
   */
  createLink(icon, iconTitle, title, link) {
    return this._createLink(icon, iconTitle, title, link);
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
    return this.shadowRoot.querySelector(".social-links");
  }

  /**
   * For backward compatibility
   */
  getTemplate() {
    return this.shadowRoot.querySelector("#social-links-template");
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
  customElements.define("app-social-links", AppSocialLinksComponent);
  console.log("Social Links component registered successfully");
} catch (error) {
  console.warn("Social Links component registration issue:", error.message);
}
