/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import linkCssTemplate from "./link.css";
import linkHtmlTemplate from "./link.html";

class AppLink extends HTMLElement {
  constructor(
    props = {
      id: "link",
      color: "",
    },
    basePath = "/components/core/link",
    templateHtml = linkHtmlTemplate,
    templateStyleUrls = [linkCssTemplate],
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
        console.log("Initial setup for app-link failed!");
      },
    );
  }

  connectedCallback() {
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
    const _app_link_container = this.shadowRoot.querySelector(".link-container");

    const _app_link = this.shadowRoot.querySelector(".link");
    _app_link.setAttribute("href", this.getAttribute("link"));

    if (this.getAttribute("icon") !== null) {
      const link = document.createElement("link");
      link.setAttribute("href", "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css");
      link.setAttribute("rel", "stylesheet");
      this.shadowRoot.prepend(link);

      const icon = document.createElement("i");
      icon.setAttribute("aria-hidden", "true");
      icon.setAttribute("part", "link-icon");
      icon.setAttribute("class", this.getAttribute("icon"));
      icon.setAttribute("title", this.getAttribute("icon-title"));
      if (this.getAttribute("icon-direction") === "right") {
        _app_link.appendChild(icon);
      } else {
        _app_link.prepend(icon);
      }
    }

    if (this.getAttribute("hover-effect") === "underline") {
      _app_link_container.classList.add("underline");
    } else {
      _app_link_container.classList.add("background");
    }

    const _app_linkTitle = this.shadowRoot.querySelector(".link-title");
    _app_linkTitle.innerText = this.getAttribute("title");
  }

  disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  static get observedAttributes() {
    return ["icon", "title", "link"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
    if (name === "title" && oldValue !== newValue) {
      this.shadowRoot.querySelector(".link-title").innerText = `${newValue}`;
    }
    if (name === "link" && oldValue !== newValue) {
      this.shadowRoot.querySelector(".link").href = `${newValue}`;
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

    const element = this.shadowRoot.querySelector("#link");
    if (element) {
      element.remove();
    }

    let link = document.createElement("div");
    link.classList.add("link");
    link.setAttribute("id", "link");
    link.innerHTML = "";

    this.shadowRoot.appendChild(link);

    return link;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#link-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  // there can be other element methods and properties
  render() {
    this.props = getComponentProps.call(this, this.props);
    const link = this.getElement();

    if (link && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the link element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "color") {
            const color_changer = this.shadowRoot.getElementById("link-input");
            color_changer.value = window.HSLToHex(getComputedStyle(document.documentElement, null).getPropertyValue("--color-primary"));
          } else if (key === "id") {
            link.setAttribute(`${key}`, value);
          }
        }
      });

      // Render children
      link.innerHTML = ""; // Clear existing content
      link.appendChild(itemTemplate);
    }
  }
}

customElements.define("app-link", AppLink);
