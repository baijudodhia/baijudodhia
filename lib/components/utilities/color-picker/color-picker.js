/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import { changeThemeColor } from "./color-picker.helper.js";
import colorPickerCssTemplate from "./color-picker.css";
import colorPickerHtmlTemplate from "./color-picker.html";

export class AppColorPicker extends HTMLElement {
  constructor(
    props = {
      id: "colorPicker",
      color: "",
    },
    basePath = "/components/core/color-picker",
    templateHtml = colorPickerHtmlTemplate,
    templateStyleUrls = [colorPickerCssTemplate],
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
        console.log("Initial setup for app-color-picker failed!");
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
    return ["color"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && newValue) {
      this.props[name] = newValue;
      this.render();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
    if (name === "color") {
      if (oldValue != newValue) {
        const color_changer = this.shadowRoot.getElementById("color-picker-input");
        color_changer.value = HSLToHex(newValue);
      }
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

    const element = this.shadowRoot.querySelector("#color-picker");
    if (element) {
      element.remove();
    }

    let colorPicker = document.createElement("div");
    colorPicker.classList.add("color-picker");
    colorPicker.setAttribute("id", "color-picker");
    colorPicker.innerHTML = "";

    this.shadowRoot.appendChild(colorPicker);

    return colorPicker;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#color-picker-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  // there can be other element methods and properties
  render() {
    this.props = getComponentProps.call(this, this.props);
    const colorPicker = this.getElement();

    if (colorPicker && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the colorPicker element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "color") {
            const color_changer = this.shadowRoot.getElementById("color-picker-input");
            color_changer.value = window.HSLToHex(getComputedStyle(document.documentElement, null).getPropertyValue("--color-primary"));
          } else if (key === "id") {
            colorPicker.setAttribute(`${key}`, value);
          }
        }
      });

      // Render children
      colorPicker.innerHTML = ""; // Clear existing content
      colorPicker.appendChild(itemTemplate);
    }
  }
}

customElements.define("app-color-picker", AppColorPicker);
