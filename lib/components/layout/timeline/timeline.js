/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import timelineCssTemplate from "./timeline.css";
import timelineHtmlTemplate from "./timeline.html";

// Centralize configuration constants
const TIMELINE_CONFIG = {
  APPEARANCES: ["primary", "secondary", "tertiary"],
  SIZES: ["xs", "s", "m", "l", "xl"],
  SHAPE: ["rounded", "curved", "rectangle"],
  LINE_STYLES: ["solid", "dashed", "dotted"],
};

export class AppTimelineComponent extends HTMLElement {
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
    templateHtml = timelineHtmlTemplate,
    templateStyleUrls = [timelineCssTemplate],
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
        console.info("Initial setup for app-timeline failed!");
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
    return ["items"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && !isEmptyValue(newValue)) {
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

    const element = this.shadowRoot.querySelector("#timeline");
    if (element) {
      element.remove();
    }

    const template = this.shadowRoot.querySelector("#timeline-template");
    const timeline = template.content.cloneNode(true);
    this.shadowRoot.appendChild(timeline);

    return this.shadowRoot.querySelector("#timeline");
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#timeline-item-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  applyAttributes(element) {
    // Apply data attributes to timeline
    Object.keys(this.props).forEach((key) => {
      const value = this.props[key];
      if (!isEmptyValue(value)) {
        if (key === "id" || key === "style") {
          element.setAttribute(key, value);
        } else if (key !== "items") {
          element.setAttribute(`data-${key}`, value);
        }
      }
    });
  }

  render() {
    this.props = getComponentProps.call(this, this.props);
    const element = this.getElement();
    const template = this.getTemplate();

    if (!element || !template || !("content" in document.createElement("template"))) {
      return;
    }

    // Apply base attributes
    this.applyAttributes(element);

    // Handle children/items
    const children = Array.from(this.children);
    if (children.length > 0) {
      children.forEach((child) => {
        const clone = this.getTemplateClone(template);
        const contentContainer = clone.querySelector("#timeline-item-content");
        if (contentContainer) {
          contentContainer.innerHTML = child.outerHTML;

          // Get the timeline item element
          const timelineItem = clone.querySelector(".timeline-item");

          // Transfer shape from timeline to individual items
          if (this.props.appearance) {
            timelineItem.setAttribute("data-appearance", this.props.appearanceshape);
          }

          if (this.props.shape) {
            timelineItem.setAttribute("data-shape", this.props.shape);
          }

          // Transfer any custom attributes from child to timeline item
          Array.from(child.attributes).forEach((attr) => {
            if (!["id", "class"].includes(attr.name)) {
              timelineItem.setAttribute(attr.name, attr.value);
            }
          });
        }
        element.appendChild(clone);
      });

      if (children.length === 1) {
        element.classList.add("single-child");
      } else {
        element.classList.remove("single-child");
      }
    }
  }
}

customElements.define("app-timeline", AppTimelineComponent);
