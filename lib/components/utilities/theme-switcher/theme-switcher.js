import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import themeSwitcherCssTemplate from "./theme-switcher.css";
import themeSwitcherHtmlTemplate from "./theme-switcher.html";

const THEME_SWITCHER_CONFIG = {
  APPEARANCES: ["primary", "secondary", "tertiary"],
  SIZES: ["xs", "s", "m", "l", "xl"],
};

export class AppThemeSwitcherComponent extends HTMLElement {
  constructor(
    props = {
      id: "theme-switcher",
      appearance: "primary",
      size: "m",
      shape: "rounded",
      style: "",
      disabled: false,
    },
    basePath = "/components/utilities/theme-switcher",
    templateHtml = themeSwitcherHtmlTemplate,
    templateStyleUrls = [themeSwitcherCssTemplate],
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
        console.error("Initial setup for app-theme-switcher failed!");
      },
    );
  }

  connectedCallback() {
    this.setupEventListeners();
    this.syncThemeState();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  static get observedAttributes() {
    return ["id", "appearance", "size", "shape", "style", "disabled"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && newValue) {
      this.props[name] = newValue;
      this.render();
    }
  }

  setupEventListeners() {
    const switchInput = this.shadowRoot?.querySelector("#theme-switcher-input");
    if (switchInput) {
      switchInput.addEventListener("change", this.handleThemeToggle.bind(this));
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", this.handleSystemThemeChange.bind(this));
  }

  removeEventListeners() {
    const switchInput = this.shadowRoot?.querySelector("#theme-switcher-input");
    if (switchInput) {
      switchInput.removeEventListener("change", this.handleThemeToggle.bind(this));
    }

    window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", this.handleSystemThemeChange.bind(this));
  }

  handleThemeToggle(event) {
    if (this.props.disabled === "true" || this.props.disabled === true) {
      event.preventDefault();
      return;
    }

    const theme = event.target.checked ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);

    this.dispatchEvent(
      new CustomEvent("themeChange", {
        detail: { theme },
        bubbles: true,
        composed: true,
      }),
    );
  }

  handleSystemThemeChange(event) {
    if (!localStorage.getItem("theme")) {
      const theme = event.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme);
      this.syncThemeState();
    }
  }

  syncThemeState() {
    const theme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    const switchInput = this.shadowRoot?.querySelector("#theme-switcher-input");
    if (switchInput) {
      switchInput.checked = theme === "dark";
    }
    document.documentElement.setAttribute("data-theme", theme);
  }

  getElement() {
    if (!this.shadowRoot) {
      return null;
    }

    const element = this.shadowRoot.querySelector(`#${this.props.id}` || "#theme-switcher");
    if (element) {
      element.remove();
    }

    const container = document.createElement("div");
    container.classList.add("theme-switcher");
    container.setAttribute("id", `${this.props.id}` || "theme-switcher");
    container.innerHTML = "";

    this.shadowRoot.appendChild(container);
    return container;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#theme-switcher-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  render() {
    this.props = getComponentProps.call(this, this.props);
    const container = this.getElement();

    if (!container || !("content" in document.createElement("template"))) {
      return;
    }

    const itemTemplate = this.getTemplateClone(this.getTemplate());

    // Apply attributes
    Object.entries(this.props).forEach(([key, value]) => {
      if (!isEmptyValue(value)) {
        if (key === "disabled") {
          container.toggleAttribute("disabled", value === "true" || value === true);
          const input = itemTemplate.querySelector("#theme-switcher-input");
          if (input) {
            input.disabled = value === "true" || value === true;
          }
        } else if (["id", "style"].includes(key)) {
          container.setAttribute(key, value);
        } else {
          container.setAttribute(`data-${key}`, value);
        }
      }
    });

    // Update the DOM
    container.innerHTML = "";
    container.appendChild(itemTemplate);
  }
}

customElements.define("app-theme-switcher", AppThemeSwitcherComponent);
