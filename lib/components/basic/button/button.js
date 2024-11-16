/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import buttonCssTemplate from "./button.css";
import buttonHtmlTemplate from "./button.html";

class AppButtonComponent extends HTMLElement {
  constructor(
    props = {
      id: "button",
      appearance: "primary",
      size: "m",
      shape: "curved",
      style: "",
      loading: false,
      disabled: false,
      label: "",
      title: "",
      "icon-left": "",
      "icon-right": "",
      href: "",
      type: "button",
    },
    basePath = "/components/base/button",
    templateHtml = buttonHtmlTemplate,
    templateStyleUrls = [buttonCssTemplate],
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
        console.log("Initial setup for app-button failed!");
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
    return ["id", "appearance", "size", "shape", "styles", "loading", "style", "disabled", "label", "icon-left", "icon-right", "type", "href", "title"];
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

    const element = this.shadowRoot.querySelector("#button");
    if (element) {
      element.remove();
    }

    let button = document.createElement("button");
    button.classList.add("button");
    button.setAttribute("id", "button");
    button.innerHTML = "";

    this.shadowRoot.appendChild(button);

    return button;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#button-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  render() {
    this.props = getComponentProps.call(this, this.props);
    const button = this.getElement();

    if (button && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the button element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "disabled") {
            if (value) {
              button.setAttribute(key);
            } else {
              button.removeAttribute(key);
            }
          } else if (key === "id") {
            button.setAttribute(`${key}`, value);
          } else if (key === "style") {
            button.setAttribute(`${key}`, value);
          } else if (key === "label") {
            const clone = itemTemplate.querySelector("#button-label");
            clone.innerText = value;
            if (!clone.hasAttribute("title")) {
              clone.setAttribute("title", value);
            }
          } else if (key === "title") {
            const clone = itemTemplate.querySelector("#button-label");
            clone.setAttribute("title", value);
          } else if (key === "icon-left") {
            const clone = itemTemplate.querySelector("#button-icon-left");
            value.split(" ").forEach((className) => {
              clone.classList.add(className);
            });
          } else if (key === "icon-right") {
            const clone = itemTemplate.querySelector("#button-icon-right");
            value.split(" ").forEach((className) => {
              clone.classList.add(className);
            });
          } else {
            button.setAttribute(`data-${key}`, value);
          }
        } else {
          // Remove specific elements from the template if the value is empty
          if (key === "label" || key === "icon-left" || key === "icon-right") {
            itemTemplate.querySelector(`#button-${key}`).remove();
          }
        }
      });

      if (this.props.type === "link" && !isEmptyValue(this.props.href)) {
        // Add click listener to open external link
        button.addEventListener("click", () => {
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

        button.innerHTML = ""; // Clear existing content
        button.appendChild(loadingAnimationContainer.cloneNode(true));
      } else {
        // Render children
        button.innerHTML = ""; // Clear existing content
        button.appendChild(itemTemplate);
      }
    }
  }
}

customElements.define("app-button", AppButtonComponent);
