/**
 * Color Picker Component - Provides UI for selecting and applying theme colors
 * Using the BaseComponent architecture for consistency and improved functionality
 */
import { BaseComponent } from "../../../utils/BaseComponent.js";
import { isEmptyValue } from "../../../utils/helper.js";
import colorPickerCssTemplate from "./color-picker.css";
import colorPickerHtmlTemplate from "./color-picker.html";

// Centralize configuration constants
const COLOR_PICKER_CONFIG = {
  APPEARANCES: ["primary", "secondary", "tertiary"],
  SIZES: ["xs", "s", "m", "l", "xl"],
  SHAPES: ["rounded", "curved", "rectangle"],
};

export class AppColorPickerComponent extends BaseComponent {
  constructor(
    props = {
      id: "color-picker",
      appearance: "primary",
      size: "m",
      style: "",
      value: "#0055ff",
      disabled: false,
    },
    basePath = "/components/utilities/color-picker",
  ) {
    super();

    // Template properties
    this.templateHtml = colorPickerHtmlTemplate;
    this.templateStyles = [colorPickerCssTemplate];

    // Component state
    this._state = {
      id: "color-picker",
      appearance: "primary",
      size: "m",
      style: "",
      value: "#0055ff",
      disabled: false,
    };

    // Bound event handlers
    this._boundHandleColorChange = this.handleColorChange.bind(this);
    this._boundHandleColorInput = this.handleColorInput.bind(this);

    // For backward compatibility
    this.props = props;
    this.basePath = basePath;
  }

  /**
   * Observed attributes for automatic change handling
   */
  static get observedAttributes() {
    return ["id", "appearance", "size", "style", "value", "disabled"];
  }

  /**
   * Handle attribute changes
   * @override
   */
  _handleAttributeChange(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    // Update both props (for backward compatibility) and _state
    this.props[name] = newValue;

    // Special handling for boolean values
    if (name === "disabled") {
      this._state[name] = newValue === "true" || newValue === true;
    } else {
      this._state[name] = newValue;
    }

    // Handle appearance changes separately to sync with theme
    if (name === "appearance") {
      this.syncWithCurrentTheme();
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
    const colorPicker = this.shadowRoot?.querySelector("#color-picker-input");
    if (colorPicker) {
      colorPicker.addEventListener("change", this._boundHandleColorChange);
      colorPicker.addEventListener("input", this._boundHandleColorInput);
    }

    // Initialize the color
    this.syncWithCurrentTheme();
  }

  /**
   * Clean up event listeners when component is disconnected
   * @override
   */
  _disconnectedCallback() {
    const colorPicker = this.shadowRoot?.querySelector("#color-picker-input");
    if (colorPicker) {
      colorPicker.removeEventListener("change", this._boundHandleColorChange);
      colorPicker.removeEventListener("input", this._boundHandleColorInput);
    }
  }

  /**
   * Synchronize the color picker with the current theme colors
   */
  syncWithCurrentTheme() {
    const appearance = this._state.appearance || "primary";
    const currentColor = getComputedStyle(document.documentElement).getPropertyValue(`--color-${appearance}`).trim();

    const colorPicker = this.shadowRoot?.querySelector("#color-picker-input");
    if (colorPicker && currentColor) {
      // Convert rgb/rgba to hex if necessary
      const hexColor = currentColor.startsWith("#") ? currentColor : this.rgbToHex(currentColor);
      colorPicker.value = hexColor;
      this._state.value = hexColor;
      this.props.value = hexColor;
    }
  }

  /**
   * Convert RGB color to hexadecimal
   * @param {string} rgb - RGB color string
   * @returns {string} - Hexadecimal color
   */
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

  /**
   * Handle color change event
   * @param {Event} event - The change event from the color input
   */
  handleColorChange(event) {
    const newColor = event.target.value;
    this._state.value = newColor;
    this.props.value = newColor;

    this.updateThemeColors(newColor);
    this.dispatchEvent(
      new CustomEvent("colorChange", {
        detail: {
          color: newColor,
          appearance: this._state.appearance || "primary",
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Handle color input event (as the user is selecting)
   * @param {Event} event - The input event from the color input
   */
  handleColorInput(event) {
    const newColor = event.target.value;
    this._state.value = newColor;
    this.props.value = newColor;

    this.updateThemeColors(newColor);
    this.dispatchEvent(
      new CustomEvent("colorInput", {
        detail: {
          color: newColor,
          appearance: this._state.appearance || "primary",
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Update the theme colors based on the selected color
   * @param {string} color - The selected color in hexadecimal
   */
  updateThemeColors(color) {
    const appearance = this._state.appearance || "primary";
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

  /**
   * Determine if white text should be used on the given background color
   * @param {Object} hsl - HSL color object
   * @returns {boolean} - True if white text should be used
   */
  shouldUseWhiteText(hsl) {
    // Use white text if the background color is dark enough
    return hsl.l <= 65;
  }

  /**
   * Convert hexadecimal color to HSL
   * @param {string} hex - Hexadecimal color
   * @returns {Object} - HSL color object
   */
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

  /**
   * Get the current color value
   * @returns {string} - The current color in hexadecimal format
   */
  getCurrentColor() {
    return this._state.value;
  }

  /**
   * Render the component
   * @override
   */
  _render() {
    if (!this.shadowRoot) {
      console.error("Shadow root not available for color picker component");
      return;
    }

    // Get or create the main container element
    let colorPicker = this.shadowRoot.querySelector(".color-picker");
    if (!colorPicker) {
      colorPicker = document.createElement("div");
      colorPicker.classList.add("color-picker");
      colorPicker.setAttribute("id", this._state.id || "color-picker");
      this.shadowRoot.appendChild(colorPicker);
    }

    // Clear existing content
    while (colorPicker.firstChild) {
      colorPicker.removeChild(colorPicker.firstChild);
    }

    // Apply data attributes
    for (const [key, value] of Object.entries(this._state)) {
      if (!isEmptyValue(value)) {
        if (["id", "style"].includes(key)) {
          colorPicker.setAttribute(key, value);
        } else if (key !== "value" && key !== "disabled") {
          colorPicker.setAttribute(`data-${key}`, value);
        }
      }
    }

    // Get the template from the shadow DOM
    const template = this.shadowRoot.querySelector("#color-picker-template");
    if (!template) {
      console.error("Color picker template not found in shadow DOM");
      return;
    }

    try {
      // Clone the template
      const fragment = template.content.cloneNode(true);

      // Set properties on the input element
      const input = fragment.querySelector("#color-picker-input");
      if (input) {
        input.value = this._state.value;
        input.disabled = this._state.disabled;
      } else {
        console.warn("Color picker input element not found in template");
      }

      // Add the fragment to the container
      colorPicker.appendChild(fragment);
    } catch (error) {
      console.error("Error rendering color picker:", error);
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
  setupEventListeners() {
    this._setupEventListeners();
  }

  /**
   * For backward compatibility
   */
  removeEventListeners() {
    this._disconnectedCallback();
  }

  /**
   * For backward compatibility
   */
  getElement() {
    if (!this.shadowRoot) {
      return null;
    }
    return this.shadowRoot.querySelector(".color-picker");
  }

  /**
   * For backward compatibility
   */
  getTemplate() {
    return this.shadowRoot.querySelector("#color-picker-template");
  }

  /**
   * For backward compatibility
   */
  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  /**
   * Validate a color string
   * @param {string} color - Color string to validate
   * @returns {boolean} - True if the color is valid
   */
  isValidColor(color) {
    if (!color || typeof color !== "string") {
      return false;
    }

    // Check for hex format (#RRGGBB or #RGB)
    if (color.match(/^#([0-9A-Fa-f]{3}){1,2}$/)) {
      return true;
    }

    // Check for rgb/rgba format
    if (color.match(/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)$/)) {
      return true;
    }

    // Check for hsl/hsla format
    if (color.match(/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+\s*)?\)$/)) {
      return true;
    }

    // Check for named colors (simplified check)
    const namedColors = [
      "black",
      "silver",
      "gray",
      "white",
      "maroon",
      "red",
      "purple",
      "fuchsia",
      "green",
      "lime",
      "olive",
      "yellow",
      "navy",
      "blue",
      "teal",
      "aqua",
      "orange",
      "aliceblue",
      "antiquewhite",
      "aquamarine",
      "azure",
      "beige",
      "bisque",
      "blanchedalmond",
      "blueviolet",
      "brown",
      "burlywood",
      "cadetblue",
      "chartreuse",
      "chocolate",
      "coral",
      "cornflowerblue",
      "cornsilk",
      "crimson",
      "cyan",
      "darkblue",
      "darkcyan",
      "darkgoldenrod",
      "darkgray",
      "darkgreen",
      "darkkhaki",
      "darkmagenta",
      "darkolivegreen",
      "darkorange",
      "darkorchid",
      "darkred",
      "darksalmon",
      "darkseagreen",
      "darkslateblue",
      "darkslategray",
      "darkturquoise",
      "darkviolet",
      "deeppink",
      "deepskyblue",
      "dimgray",
      "dodgerblue",
      "firebrick",
      "floralwhite",
      "forestgreen",
      "gainsboro",
      "ghostwhite",
      "gold",
      "goldenrod",
      "greenyellow",
      "honeydew",
      "hotpink",
      "indianred",
      "indigo",
      "ivory",
      "khaki",
      "lavender",
      "lavenderblush",
      "lawngreen",
      "lemonchiffon",
      "lightblue",
      "lightcoral",
      "lightcyan",
      "lightgoldenrodyellow",
      "lightgray",
      "lightgreen",
      "lightpink",
      "lightsalmon",
      "lightseagreen",
      "lightskyblue",
      "lightslategray",
      "lightsteelblue",
      "lightyellow",
      "limegreen",
      "linen",
      "magenta",
      "mediumaquamarine",
      "mediumblue",
      "mediumorchid",
      "mediumpurple",
      "mediumseagreen",
      "mediumslateblue",
      "mediumspringgreen",
      "mediumturquoise",
      "mediumvioletred",
      "midnightblue",
      "mintcream",
      "mistyrose",
      "moccasin",
      "navajowhite",
      "oldlace",
      "olivedrab",
      "orangered",
      "orchid",
      "palegoldenrod",
      "palegreen",
      "paleturquoise",
      "palevioletred",
      "papayawhip",
      "peachpuff",
      "peru",
      "pink",
      "plum",
      "powderblue",
      "rosybrown",
      "royalblue",
      "saddlebrown",
      "salmon",
      "sandybrown",
      "seagreen",
      "seashell",
      "sienna",
      "skyblue",
      "slateblue",
      "slategray",
      "snow",
      "springgreen",
      "steelblue",
      "tan",
      "thistle",
      "tomato",
      "turquoise",
      "violet",
      "wheat",
      "whitesmoke",
      "yellowgreen",
    ];

    return namedColors.includes(color.toLowerCase());
  }

  /**
   * Set the color programmatically and trigger appropriate events
   * @param {string} color - Hexadecimal color value to set
   * @param {boolean} updateTheme - Whether to update the theme colors (default: true)
   * @returns {boolean} - Success status
   */
  setColor(color, updateTheme = true) {
    if (!this.isValidColor(color)) {
      console.error("Invalid color format:", color);
      return false;
    }

    // Convert to hex if not already in hex format
    let hexColor = color;
    if (!color.startsWith("#")) {
      // For named colors or rgb/hsl formats, create a temporary element to get computed color
      const tempEl = document.createElement("div");
      tempEl.style.color = color;
      document.body.appendChild(tempEl);
      const computedColor = getComputedStyle(tempEl).color;
      document.body.removeChild(tempEl);

      // Convert rgb to hex
      hexColor = this.rgbToHex(computedColor);
    }

    // Update state and props
    this._state.value = hexColor;
    this.props.value = hexColor;

    // Update the input element
    const colorInput = this.shadowRoot?.querySelector("#color-picker-input");
    if (colorInput) {
      colorInput.value = hexColor;
    }

    // Update theme if requested
    if (updateTheme) {
      this.updateThemeColors(hexColor);
    }

    // Dispatch event
    this.dispatchEvent(
      new CustomEvent("colorChange", {
        detail: {
          color: hexColor,
          appearance: this._state.appearance || "primary",
        },
        bubbles: true,
        composed: true,
      }),
    );

    return true;
  }

  /**
   * Reset the color to the default theme color for the current appearance
   * @returns {boolean} - Success status
   */
  resetToDefaultColor() {
    const appearance = this._state.appearance || "primary";
    let defaultColor;

    // Get the default color from CSS variables
    switch (appearance) {
      case "primary":
        defaultColor = getComputedStyle(document.documentElement).getPropertyValue("--default-color-primary").trim() || "#0055ff";
        break;
      case "secondary":
        defaultColor = getComputedStyle(document.documentElement).getPropertyValue("--default-color-secondary").trim() || "#6c757d";
        break;
      case "tertiary":
        defaultColor = getComputedStyle(document.documentElement).getPropertyValue("--default-color-tertiary").trim() || "#17a2b8";
        break;
      default:
        defaultColor = "#0055ff";
    }

    // If the CSS variable is not set or empty, use fallback colors
    if (!defaultColor || defaultColor === "") {
      switch (appearance) {
        case "primary":
          defaultColor = "#0055ff";
          break;
        case "secondary":
          defaultColor = "#6c757d";
          break;
        case "tertiary":
          defaultColor = "#17a2b8";
          break;
      }
    }

    // Ensure the color starts with #
    if (!defaultColor.startsWith("#")) {
      defaultColor = "#" + defaultColor;
    }

    return this.setColor(defaultColor);
  }

  /**
   * Set the disabled state of the color picker
   * @param {boolean} isDisabled - Whether the color picker should be disabled
   */
  setDisabled(isDisabled) {
    // Update state and props
    this._state.disabled = !!isDisabled;
    this.props.disabled = !!isDisabled;

    // Update the attribute to reflect the state
    if (isDisabled) {
      this.setAttribute("disabled", "true");
    } else {
      this.removeAttribute("disabled");
    }

    // Update the input element
    const colorInput = this.shadowRoot?.querySelector("#color-picker-input");
    if (colorInput) {
      colorInput.disabled = !!isDisabled;
    }

    // Re-render to ensure all changes are applied
    this._render();
  }

  /**
   * Toggle the disabled state of the color picker
   * @returns {boolean} - The new disabled state
   */
  toggleDisabled() {
    const newState = !this._state.disabled;
    this.setDisabled(newState);
    return newState;
  }
}

// Register the component with improved error handling
try {
  customElements.define("app-color-picker", AppColorPickerComponent);
  console.log("Color Picker component registered successfully");
} catch (error) {
  console.warn("Color Picker component registration issue:", error.message);
}
