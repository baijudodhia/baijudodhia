/**
 * Timeline Component - A versatile timeline component for displaying events in chronological order
 * Using the BaseComponent architecture for consistency and improved functionality
 */
import { BaseComponent } from "../../../utils/BaseComponent.js";
import { isEmptyValue } from "../../../utils/helper.js";
import timelineCssTemplate from "./timeline.css";
import timelineHtmlTemplate from "./timeline.html";

// Centralize configuration constants
const TIMELINE_CONFIG = {
  APPEARANCES: ["primary", "secondary", "tertiary", "mono"],
  SIZES: ["xs", "s", "m", "l", "xl"],
  SHAPES: ["rounded", "curved", "rectangle"],
  LINE_STYLES: ["solid", "dashed", "dotted"],
};

export class AppTimelineComponent extends BaseComponent {
  constructor(
    props = {
      id: "timeline",
      appearance: "",
      size: "m",
      style: "",
      shape: "rounded",
      "line-style": "dashed",
      items: [],
    },
    basePath = "/components/base/timeline",
  ) {
    super();

    // Template properties
    this.templateHtml = timelineHtmlTemplate;
    this.templateStyles = [timelineCssTemplate];

    // Component state
    this._state = {
      id: "timeline",
      appearance: "",
      size: "m",
      style: "",
      shape: "rounded",
      lineStyle: "dashed",
      items: [],
    };

    // For backward compatibility
    this.props = props;
    this.basePath = basePath;
  }

  /**
   * Observed attributes for automatic change handling
   */
  static get observedAttributes() {
    return ["id", "appearance", "size", "style", "shape", "line-style", "items"];
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
    if (name === "line-style") {
      this._state.lineStyle = newValue;
    } else if (name === "items" && typeof newValue === "string") {
      try {
        this._state.items = JSON.parse(newValue);
      } catch (error) {
        console.error("Failed to parse items:", error);
        this._state.items = [];
      }
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
    // No specific event listeners needed for basic timeline functionality
  }

  /**
   * Apply attributes to an element
   * @private
   */
  _applyAttributes(element) {
    // Apply data attributes to timeline
    Object.keys(this._state).forEach((key) => {
      const value = this._state[key];
      if (!isEmptyValue(value)) {
        if (key === "id" || key === "style") {
          element.setAttribute(key, value);
        } else if (key === "lineStyle") {
          element.setAttribute("data-line-style", value);
        } else if (key !== "items") {
          element.setAttribute(`data-${key}`, value);
        }
      }
    });
  }

  /**
   * Render the component
   * @override
   */
  _render() {
    if (!this.shadowRoot) return;

    // Get or create the main timeline element (already created by BaseComponent)
    const timeline = this.shadowRoot.querySelector("#timeline");
    if (!timeline) {
      console.error("Timeline element not found in shadow DOM");
      return;
    }

    // Clear existing content
    while (timeline.firstChild) {
      timeline.removeChild(timeline.firstChild);
    }

    // Apply base attributes
    this._applyAttributes(timeline);

    // Get the template
    const template = this.shadowRoot.querySelector("#timeline-item-template");
    if (!template) {
      console.error("Timeline item template not found in shadow DOM");
      return;
    }

    // Handle children/items
    const children = Array.from(this.children);
    if (children.length > 0) {
      children.forEach((child) => {
        const clone = template.content.cloneNode(true);
        const contentContainer = clone.querySelector("#timeline-item-content");

        if (contentContainer) {
          contentContainer.innerHTML = child.outerHTML;

          // Get the timeline item element
          const timelineItem = clone.querySelector(".timeline-item");

          // Transfer appearance and shape from timeline to individual items
          if (this._state.appearance) {
            timelineItem.setAttribute("data-appearance", this._state.appearance);
          }

          if (this._state.shape) {
            timelineItem.setAttribute("data-shape", this._state.shape);
          }

          // Transfer any custom attributes from child to timeline item
          Array.from(child.attributes).forEach((attr) => {
            if (!["id", "class"].includes(attr.name)) {
              timelineItem.setAttribute(attr.name, attr.value);
            }
          });
        }

        timeline.appendChild(clone);
      });

      // Handle single child case
      if (children.length === 1) {
        timeline.classList.add("single-child");
      } else {
        timeline.classList.remove("single-child");
      }
    }
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
    return this.shadowRoot.querySelector("#timeline");
  }

  /**
   * For backward compatibility
   */
  getTemplate() {
    return this.shadowRoot.querySelector("#timeline-item-template");
  }

  /**
   * For backward compatibility
   */
  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  /**
   * For backward compatibility
   */
  applyAttributes(element) {
    this._applyAttributes(element);
  }
}

// Register the component with improved error handling
try {
  customElements.define("app-timeline", AppTimelineComponent);
  console.log("Timeline component registered successfully");
} catch (error) {
  console.warn("Timeline component registration issue:", error.message);
}
