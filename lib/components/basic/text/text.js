/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the style applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import textCssTemplate from "./text.css";
import textHtmlTemplate from "./text.html";

export class AppTextComponent extends HTMLElement {
  constructor(
    props = {
      id: "text",
      appearance: "",
      size: "m",
      style: "",
      text: "",
      title: "",
      "icon-left": "",
      "icon-right": "",
      href: "",
      variant: "text",
    },
    basePath = "/components/base/text",
    templateHtml = textHtmlTemplate,
    templateStyleUrls = [textCssTemplate],
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
        console.log("Initial setup for app-text failed!");
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
    return ["id", "appearance", "size", "style", "text", "icon-left", "icon-right", "variant", "href"];
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

    const element = this.shadowRoot.querySelector(`#${this.props.id}` || "#text");
    if (element) {
      element.remove();
    }

    let text = document.createElement("div");
    text.classList.add("text");
    text.setAttribute("id", `${this.props.id}` || "text");
    text.innerHTML = "";

    this.shadowRoot.appendChild(text);

    return text;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#text-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  render() {
    this.props = getComponentProps.call(this, this.props);
    const text = this.getElement();

    if (text && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the text element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "id") {
            text.setAttribute(`${key}`, value);
          } else if (key === "style") {
            text.setAttribute(`${key}`, value);
          } else if (key === "text") {
            const clone = itemTemplate.querySelector("#text-text");
            clone.innerText = value;
            if (!clone.hasAttribute("title")) {
              clone.setAttribute("title", value);
            }
          } else if (key === "title") {
            const clone = itemTemplate.querySelector("#text-text");
            clone.setAttribute("title", value);
          } else if (key === "icon-left") {
            const clone = itemTemplate.querySelector("#text-icon-left");
            value.split(" ").forEach((className) => {
              clone.classList.add(className);
            });
          } else if (key === "icon-right") {
            const clone = itemTemplate.querySelector("#text-icon-right");
            value.split(" ").forEach((className) => {
              clone.classList.add(className);
            });
          } else {
            text.setAttribute(`data-${key}`, value);
          }
        } else {
          // Remove specific elements from the template if the value is empty
          if (key === "text" || key === "icon-left" || key === "icon-right") {
            itemTemplate.querySelector(`#text-${key}`).remove();
          }
        }
      });

      if (this.props.variant === "link" && !isEmptyValue(this.props.href)) {
        // Add click listener to open external link
        text.addEventListener("click", () => {
          const newWindow = window.open(this.props.href, "_blank", "noopener,noreferrer");

          if (newWindow) {
            newWindow.opener = null; // Ensure the new window cannot access the opener
            newWindow.location = this.props.href; // Open the link securely
          } else {
            console.error("Failed to open new window.");
          }
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

        text.innerHTML = ""; // Clear existing content
        text.appendChild(loadingAnimationContainer.cloneNode(true));
      } else {
        // Render children
        text.innerHTML = ""; // Clear existing content
        text.appendChild(itemTemplate);
      }
    }
  }
}

customElements.define("app-text", AppTextComponent);
