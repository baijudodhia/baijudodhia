/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import themeSwitcherCssTemplate from "./theme-switcher.css";
import themeSwitcherHtmlTemplate from "./theme-switcher.html";

class AppThemeSwitcher extends HTMLElement {
  constructor(
    props = {
      id: "themeSwitcher",
      color: "",
    },
    basePath = "/components/core/theme-switcher",
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
      },
      () => {
        console.log("Initial setup failed!");
      },
    );
  }

  connectedCallback() {
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  static get observedAttributes() {
    return [
      /* Attributes to observe. */
      "value",
      "theme",
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
    if (name === "value" && oldValue !== null) {
      this.shadowRoot.querySelector("#theme-switcher").setAttribute("value", newValue);
    }
    if (name === "theme" && oldValue !== null) {
      let themeSwitcherChecked = newValue === "dark" ? true : false;
      this.shadowRoot.querySelector("#theme-switcher").checked = themeSwitcherChecked;
      this.shadowRoot.querySelector("#theme-switcher").setAttribute("theme", newValue);
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

    const element = this.shadowRoot.querySelector("#theme-switcher");
    if (element) {
      element.remove();
    }

    let themeSwitcher = document.createElement("div");
    themeSwitcher.classList.add("theme-switcher");
    themeSwitcher.setAttribute("id", "theme-switcher");
    themeSwitcher.innerHTML = "";

    this.shadowRoot.appendChild(themeSwitcher);

    return themeSwitcher;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#theme-switcher-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  // there can be other element methods and properties
  render() {
    this.props = getComponentProps.call(this, this.props);
    const themeSwitcher = this.getElement();

    if (themeSwitcher && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the themeSwitcher element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "color") {
            const color_changer = this.shadowRoot.getElementById("theme-switcher-input");
            color_changer.value = window.HSLToHex(getComputedStyle(document.documentElement, null).getPropertyValue("--color-primary"));
          } else if (key === "id") {
            themeSwitcher.setAttribute(`${key}`, value);
          }
        }
      });

      // Render children
      themeSwitcher.innerHTML = ""; // Clear existing content
      themeSwitcher.appendChild(itemTemplate);
    }
  }
}

customElements.define("app-theme-switcher", AppThemeSwitcher);
