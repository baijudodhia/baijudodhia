/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the style applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import labelCssTemplate from "./label.css";
import labelHtmlTemplate from "./label.html";

class AppLabelComponent extends HTMLElement {
  constructor(
    props = {
      id: "label",
      appearance: "",
      size: "m",
      style: "",
      label: "",
      title: "",
      "icon-left": "",
      "icon-right": "",
      href: "",
      variant: "text",
    },
    basePath = "/components/base/label",
    templateHtml = labelHtmlTemplate,
    templateStyleUrls = [labelCssTemplate],
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
        console.log("Initial setup for app-label failed!");
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
    return ["id", "appearance", "size", "style", "label", "icon-left", "icon-right", "variant", "href"];
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

    const element = this.shadowRoot.querySelector("#label");
    if (element) {
      element.remove();
    }

    let label = document.createElement("div");
    label.classList.add("label");
    label.setAttribute("id", "label");
    label.innerHTML = "";

    this.shadowRoot.appendChild(label);

    return label;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#label-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  render() {
    this.props = getComponentProps.call(this, this.props);
    const label = this.getElement();

    if (label && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the label element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "id") {
            label.setAttribute(`${key}`, value);
          } else if (key === "style") {
            label.setAttribute(`${key}`, value);
          } else if (key === "label") {
            const clone = itemTemplate.querySelector("#label-label");
            clone.innerText = value;
            if (!clone.hasAttribute("title")) {
              clone.setAttribute("title", value);
            }
          } else if (key === "title") {
            const clone = itemTemplate.querySelector("#label-label");
            clone.setAttribute("title", value);
          } else if (key === "icon-left") {
            const clone = itemTemplate.querySelector("#label-icon-left");
            value.split(" ").forEach((className) => {
              clone.classList.add(className);
            });
          } else if (key === "icon-right") {
            const clone = itemTemplate.querySelector("#label-icon-right");
            value.split(" ").forEach((className) => {
              clone.classList.add(className);
            });
          } else {
            label.setAttribute(`data-${key}`, value);
          }
        } else {
          // Remove specific elements from the template if the value is empty
          if (key === "label" || key === "icon-left" || key === "icon-right") {
            itemTemplate.querySelector(`#label-${key}`).remove();
          }
        }
      });

      if (this.props.type === "link" && !isEmptyValue(this.props.href)) {
        // Add click listener to open external link
        label.addEventListener("click", () => {
          window.open(this.props.href, "_blank");
        });
      }

      if (this.props.loading === "true") {
        // Render loading animations
        const loadingAnimationContainer = document.createElement("div");
        loadingAnimationContainer.setAttribute("id", "loader-container");

        const loadingAnimation = document.createElement("div");
        loadingAnimation.setAttribute("id", "loader");
        loadingAnimation.setAttribute("data-appearance", this.props.appearance);
        loadingAnimation.setAttribute("data-size", this.props.size);
        loadingAnimation.setAttribute("disabled", true);

        loadingAnimationContainer.appendChild(loadingAnimation.cloneNode(true));

        label.innerHTML = ""; // Clear existing content
        label.appendChild(loadingAnimationContainer.cloneNode(true));
      } else {
        // Render children
        label.innerHTML = ""; // Clear existing content
        label.appendChild(itemTemplate);
      }
    }
  }
}

customElements.define("app-label", AppLabelComponent);
