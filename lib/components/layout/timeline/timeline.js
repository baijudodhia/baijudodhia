/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, setComponentTemplate } from "../../../utils/index.js";
import timelineCssTemplate from "./timeline.css";
import timelineHtmlTemplate from "./timeline.html";

class AppTimelineComponent extends HTMLElement {
  constructor(
    props = {
      id: "timeline",
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
        console.log("Initial setup for app-timeline failed!");
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

    const element = this.shadowRoot.querySelector("#timeline");
    if (element) {
      element.remove();
    }

    let timeline = document.createElement("ul");
    timeline.classList.add("timeline");
    timeline.setAttribute("id", "timeline");
    timeline.innerHTML = "";

    this.shadowRoot.appendChild(timeline);

    return timeline;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#timeline-item-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  render() {
    this.props = getComponentProps.call(this, this.props);

    const element = this.getElement();
    const template = this.getTemplate();
    const children = Array.from(this.children);

    if (element && "content" in document.createElement("template")) {
      children.forEach((child) => {
        const clone = this.getTemplateClone(template);

        clone.querySelector(".timeline-item-content").innerHTML = child.outerHTML;

        element.appendChild(clone);
      });

      if (children.length === 1) {
        element.classList.add("single-child");
      }
    }
  }
}

customElements.define("app-timeline", AppTimelineComponent);
