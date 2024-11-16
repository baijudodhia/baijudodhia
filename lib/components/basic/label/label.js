/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import labelCssTemplate from "./label.css";
import labelHtmlTemplate from "./label.html";

class AppLabel extends HTMLElement {
  constructor(
    props = {
      id: "label",
      color: "",
    },
    basePath = "/components/core/label",
    templateHtml = labelCssTemplate,
    templateStyleUrls = [labelHtmlTemplate],
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
        console.log("Initial setup failed!");
      },
    );
  }

  /**
   * 1. Browser calls this method when the element is added to the document.
   * 2. Can be called many times if an element is repeatedly added/removed.
   */
  connectedCallback() {
    const _app_lwi_container = this.shadowRoot.querySelector(".label");

    const link = document.createElement("link");
    link.setAttribute("href", "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css");
    link.setAttribute("rel", "stylesheet");
    this.shadowRoot.prepend(link);

    const _api_lwi_icon = this.shadowRoot.querySelector(".lwi-icon");
    const _api_lwi_icon_classList = this.getAttribute("icon").split(" ");
    _api_lwi_icon_classList.forEach((e) => {
      _api_lwi_icon.classList.add(e);
    });
    if (this.hasAttribute("icon_title")) {
      _api_lwi_icon.setAttribute("title", this.getAttribute("icon_title"));
    }

    const _app_lwi_label = this.shadowRoot.querySelector(".lwi-label");
    _app_lwi_label.innerText = this.getAttribute("label");
  }

  /**
   * 1. Browser calls this method when the element is removed from the document.
   * 2. Can be called many times if an element is repeatedly added/removed.
   */
  disconnectedCallback() {}

  static get observedAttributes() {
    return ["icon", "label"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
    if (name === "icon" && oldValue !== newValue) {
      if (oldValue !== null && oldValue !== undefined && oldValue !== "") {
        const old_value_class_list = oldValue.split(" ");
        old_value_class_list.forEach((e) => {
          if (this.shadowRoot.querySelector(".lwi-icon").classList.contains(e)) {
            this.shadowRoot.querySelector(".lwi-icon").classList.remove(e);
          }
        });
      }
      const new_value_class_list = newValue.split(" ");
      new_value_class_list.forEach((e) => {
        this.shadowRoot.querySelector(".lwi-icon").classList.add(e);
      });
    }
    if (name === "label" && oldValue !== newValue) {
      this.shadowRoot.querySelector(".lwi-label").innerText = `${newValue}`;
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

  // there can be other element methods and properties
  render() {
    this.props = getComponentProps.call(this, this.props);
    const label = this.getElement();

    if (label && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the label element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "color") {
            const color_changer = this.shadowRoot.getElementById("label-input");
            color_changer.value = window.HSLToHex(getComputedStyle(document.documentElement, null).getPropertyValue("--color-primary"));
          } else if (key === "id") {
            label.setAttribute(`${key}`, value);
          }
        }
      });

      // Render children
      label.innerHTML = ""; // Clear existing content
      label.appendChild(itemTemplate);
    }
  }
}

customElements.define("app-label", AppLabel);
