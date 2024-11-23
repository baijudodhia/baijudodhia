import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import colorPickerCssTemplate from "./color-picker.css";
import colorPickerHtmlTemplate from "./color-picker.html";

const COLOR_PICKER_CONFIG = {
  APPEARANCES: ["primary", "secondary", "tertiary"],
  SIZES: ["xs", "s", "m", "l", "xl"],
};

export class AppColorPickerComponent extends HTMLElement {
  constructor(
    props = {
      id: "color-picker",
      appearance: "primary",
      size: "m",
      style: "",
      value: "#0055ff",
      disabled: false,
    },
    basePath = "/components/custom/color-picker",
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
        this.setupEventListeners();
      },
      () => {
        console.error("Initial setup for app-color-picker failed!");
      },
    );
  }

  connectedCallback() {
    this.setupEventListeners();
    this.syncWithCurrentTheme();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  static get observedAttributes() {
    return ["id", "appearance", "size", "style", "value", "disabled"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && newValue !== null) {
      this.props[name] = newValue;

      if (name === "appearance") {
        this.syncWithCurrentTheme();
      }

      this.render();
    }
  }

  syncWithCurrentTheme() {
    const appearance = this.getAttribute("appearance") || "primary";
    const currentColor = getComputedStyle(document.documentElement).getPropertyValue(`--color-${appearance}`).trim();

    const colorPicker = this.shadowRoot?.querySelector("#color-picker-input");
    if (colorPicker && currentColor) {
      // Convert rgb/rgba to hex if necessary
      const hexColor = currentColor.startsWith("#") ? currentColor : this.rgbToHex(currentColor);
      colorPicker.value = hexColor;
    }
  }

  rgbToHex(rgb) {
    // Remove spaces and 'rgb(' or 'rgba('
    const values = rgb.replace(/\s/g, "").match(/^rgba?\((\d+),(\d+),(\d+)/i);
    if (!values) return "#000000";

    const r = parseInt(values[1], 10);
    const g = parseInt(values[2], 10);
    const b = parseInt(values[3], 10);

    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  setupEventListeners() {
    const colorPicker = this.shadowRoot?.querySelector("#color-picker-input");
    if (colorPicker) {
      colorPicker.addEventListener("change", this.handleColorChange.bind(this));
      colorPicker.addEventListener("input", this.handleColorInput.bind(this));
    }
  }

  removeEventListeners() {
    const colorPicker = this.shadowRoot?.querySelector("#color-picker-input");
    if (colorPicker) {
      colorPicker.removeEventListener("change", this.handleColorChange.bind(this));
      colorPicker.removeEventListener("input", this.handleColorInput.bind(this));
    }
  }

  handleColorChange(event) {
    const newColor = event.target.value;
    this.updateThemeColors(newColor);
    this.dispatchEvent(
      new CustomEvent("colorChange", {
        detail: {
          color: newColor,
          appearance: this.getAttribute("appearance") || "primary",
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  handleColorInput(event) {
    const newColor = event.target.value;
    this.updateThemeColors(newColor);
    this.dispatchEvent(
      new CustomEvent("colorInput", {
        detail: {
          color: newColor,
          appearance: this.getAttribute("appearance") || "primary",
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  updateThemeColors(color) {
    const appearance = this.getAttribute("appearance") || "primary";
    const hsl = this.hexToHSL(color);

    // Only update CSS variables for the specified appearance
    switch (appearance) {
      case "primary":
        // Base color
        document.documentElement.style.setProperty("--color-primary", color);
        // Hover: Lighter and slightly more saturated
        document.documentElement.style.setProperty("--color-primary-hover", `hsl(${hsl.h}, ${Math.min(hsl.s + 15, 100)}%, ${Math.min(hsl.l + 35, 95)}%)`);
        // Active: Darker and more saturated
        document.documentElement.style.setProperty("--color-primary-active", `hsl(${hsl.h}, ${Math.min(hsl.s + 20, 100)}%, ${Math.max(hsl.l - 20, 15)}%)`);
        document.documentElement.style.setProperty("--color-primary-text", this.shouldUseWhiteText(hsl) ? "#ffffff" : "#000000");
        break;

      case "secondary":
        document.documentElement.style.setProperty("--color-secondary", color);
        document.documentElement.style.setProperty("--color-secondary-hover", `hsl(${hsl.h}, ${Math.min(hsl.s + 15, 100)}%, ${Math.min(hsl.l + 35, 95)}%)`);
        document.documentElement.style.setProperty("--color-secondary-active", `hsl(${hsl.h}, ${Math.min(hsl.s + 20, 100)}%, ${Math.max(hsl.l - 20, 15)}%)`);
        document.documentElement.style.setProperty("--color-secondary-text", this.shouldUseWhiteText(hsl) ? "#ffffff" : "#000000");
        break;

      case "tertiary":
        document.documentElement.style.setProperty("--color-tertiary", color);
        document.documentElement.style.setProperty("--color-tertiary-hover", `hsl(${hsl.h}, ${Math.min(hsl.s + 15, 100)}%, ${Math.min(hsl.l + 35, 95)}%)`);
        document.documentElement.style.setProperty("--color-tertiary-active", `hsl(${hsl.h}, ${Math.min(hsl.s + 20, 100)}%, ${Math.max(hsl.l - 20, 15)}%)`);
        document.documentElement.style.setProperty("--color-tertiary-text", this.shouldUseWhiteText(hsl) ? "#ffffff" : "#000000");
        break;
    }
  }

  shouldUseWhiteText(hsl) {
    // Use white text if the background color is dark enough
    return hsl.l <= 65;
  }

  hexToHSL(hex) {
    // Remove the hash if present
    hex = hex.replace(/^#/, "");

    // Convert hex to RGB
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  getElement() {
    if (!this.shadowRoot) return null;

    const element = this.shadowRoot.querySelector("#color-picker");
    if (element) element.remove();

    const colorPicker = document.createElement("div");
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

  render() {
    this.props = getComponentProps.call(this, this.props);
    const colorPicker = this.getElement();

    if (colorPicker && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply attributes to the color picker
      Object.keys(this.props).forEach((key) => {
        const value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "id" || key === "style") {
            colorPicker.setAttribute(key, value);
          } else if (key === "value") {
            const input = itemTemplate.querySelector("#color-picker-input");
            input.value = value;
          } else if (key === "disabled") {
            const input = itemTemplate.querySelector("#color-picker-input");
            input.disabled = value === "true" || value === true;
          } else {
            colorPicker.setAttribute(`data-${key}`, value);
          }
        }
      });

      colorPicker.innerHTML = "";
      colorPicker.appendChild(itemTemplate);
    }
  }
}

customElements.define("app-color-picker", AppColorPickerComponent);
