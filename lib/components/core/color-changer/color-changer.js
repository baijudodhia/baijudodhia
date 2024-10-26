/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import colorChangerCssTemplate from "./color-changer.css";
import colorChangerHtmlTemplate from "./color-changer.html";

class AppColorChanger extends HTMLElement {
  constructor(
    props = {
      id: "colorChanger",
      color: "",
    },
    basePath = "/components/core/color-changer",
    templateHtml = colorChangerHtmlTemplate,
    templateStyleUrls = [colorChangerCssTemplate],
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
        const color_changer = this.shadowRoot.getElementById("color-changer-input");
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

    const element = this.shadowRoot.querySelector("#color-changer");
    if (element) {
      element.remove();
    }

    let colorChanger = document.createElement("div");
    colorChanger.classList.add("color-changer");
    colorChanger.setAttribute("id", "color-changer");
    colorChanger.innerHTML = "";

    this.shadowRoot.appendChild(colorChanger);

    return colorChanger;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#color-changer-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  // there can be other element methods and properties
  render() {
    this.props = getComponentProps.call(this, this.props);
    const colorChanger = this.getElement();

    if (colorChanger && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the colorChanger element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "color") {
            const color_changer = this.shadowRoot.getElementById("color-changer-input");
            color_changer.value = window.HSLToHex(getComputedStyle(document.documentElement, null).getPropertyValue("--color-primary"));
          } else if (key === "id") {
            colorChanger.setAttribute(`${key}`, value);
          }
        }
      });

      // Render children
      colorChanger.innerHTML = ""; // Clear existing content
      colorChanger.appendChild(itemTemplate);
    }
  }
}

customElements.define("app-color-changer", AppColorChanger);

export function changeThemeColor(value) {
  let color = HexToHSL(value);

  const primary_light = "hsl(" + color.h + ", 100%, 50%)";
  const secondary_light = "hsl(" + color.h + ", 100%, 30%)";
  const tertiary_light = "hsl(" + color.h + ", 100%, 70%)";
  const bw_primary_light = "hsl(0, 0%, 100%)";
  const bw_primary_light_invert = "hsl(0, 0%, 0%)";
  const bw_secondary_light = "hsl(" + color.h + ", 100%, 95%)";
  const bw_secondary_light_invert = "hsl(" + color.h + ", 100%, 5%)";
  const primary_dark = "hsl(" + color.h + ", 100%, 50%)";
  const secondary_dark = "hsl(" + color.h + ", 100%, 70%)";
  const tertiary_dark = "hsl(" + color.h + ", 100%, 30%)";
  const bw_primary_dark = "hsl(0, 0%, 0%)";
  const bw_primary_dark_invert = "hsl(0, 0%, 100%)";
  const bw_secondary_dark = "hsl(" + color.h + ", 100%, 5%)";
  const bw_secondary_dark_invert = "hsl(" + color.h + ", 100%, 95%)";

  document.documentElement.style.setProperty("--color-primary_light", primary_light);
  document.documentElement.style.setProperty("--color-secondary_light", secondary_light);
  document.documentElement.style.setProperty("--color-tertiary_light", tertiary_light);
  document.documentElement.style.setProperty("--color-bw_primary_light", bw_primary_light);
  document.documentElement.style.setProperty("--color-bw_primary_light_invert", bw_primary_light_invert);
  document.documentElement.style.setProperty("--color-bw_secondary_light", bw_secondary_light);
  document.documentElement.style.setProperty("--color-bw_secondary_light_invert", bw_secondary_light_invert);
  document.documentElement.style.setProperty("--color-primary_dark", primary_dark);
  document.documentElement.style.setProperty("--color-secondary_dark", secondary_dark);
  document.documentElement.style.setProperty("--color-tertiary_dark", tertiary_dark);
  document.documentElement.style.setProperty("--color-bw_primary_dark", bw_primary_dark);
  document.documentElement.style.setProperty("--color-bw_primary_dark_invert", bw_primary_dark_invert);
  document.documentElement.style.setProperty("--color-bw_secondary_dark", bw_secondary_dark);
  document.documentElement.style.setProperty("--color-bw_secondary_dark_invert", bw_secondary_dark_invert);

  document.querySelector("app-color-changer").setAttribute("color", primary_light);
}
