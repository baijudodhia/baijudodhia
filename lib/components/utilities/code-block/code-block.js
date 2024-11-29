import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import codeBlockCssTemplate from "./code-block.css";
import codeBlockHtmlTemplate from "./code-block.html";

const loadDependencies = async () => {
  try {
    await new Promise((resolve, reject) => {
      if (window.hljs) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return window.hljs;
  } catch (error) {
    console.error("Failed to load highlight.js:", error);
    return null;
  }
};

export class AppCodeBlockComponent extends HTMLElement {
  constructor(
    props = {
      id: "code-block",
      appearance: "primary",
      size: "m",
      shape: "curved",
      style: "",
      title: "",
      code: "",
      language: "plaintext",
    },
    basePath = "/components/utilities/code-block",
    templateHtml = codeBlockHtmlTemplate,
    templateStyleUrls = [codeBlockCssTemplate],
  ) {
    super();

    this.props = props;
    this.basePath = basePath;
    this.templateHtml = templateHtml;
    this.templateStyleUrls = templateStyleUrls;
    this.hljs = null;

    this.init();
  }

  async init() {
    try {
      this.hljs = await loadDependencies();
      await setComponentTemplate.call(
        this,
        () => {
          this.render();
          this.setupCopyButton();
        },
        () => console.error("Initial setup for app-code-block failed!"),
      );
    } catch (error) {
      console.error("Failed to initialize code block component:", error);
    }
  }

  static get observedAttributes() {
    return ["id", "appearance", "size", "shape", "style", "title", "code", "language"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !newValue) return;

    this.props[name] = newValue;
    this.render();
  }

  setupCopyButton() {
    const copyBtn = this.shadowRoot.querySelector("app-button");
    copyBtn?.addEventListener("click", async () => {
      try {
        const code = this.props.code;
        await navigator.clipboard.writeText(code);

        copyBtn.setAttribute("icon-right", "fa fa-check");
        copyBtn.setAttribute("disabled", "true");

        setTimeout(() => {
          copyBtn.setAttribute("icon-right", "fa fa-copy");
          copyBtn.setAttribute("disabled", "false");
        }, 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    });
  }

  render() {
    this.props = getComponentProps.call(this, this.props);
    const container = this.shadowRoot.querySelector("#code-block");
    if (!container) return;

    // Apply attributes
    Object.entries(this.props).forEach(([key, value]) => {
      if (!isEmptyValue(value)) {
        if (["id", "style"].includes(key)) {
          container.setAttribute(key, value);
        } else if (!["code", "language", "title"].includes(key)) {
          container.setAttribute(`data-${key}`, value);
        }
      }
    });

    // Set title
    if (this.props.title) {
      const titleEl = container.querySelector("#code-title");
      titleEl.textContent = this.props.title;
    }

    // Set button appearance and size based on container
    const copyBtn = container.querySelector("app-button");
    if (copyBtn) {
      const getButtonSize = (propSize) => {
        switch (propSize) {
          case "xxs":
            return "xs";
          case "xs":
            return "xs";
          case "s":
            return "xs";
          case "m":
            return "s";
          case "l":
            return "m";
          case "xl":
            return "l";
          case "xxl":
            return "xl";
          default:
            return "s";
        }
      };
      copyBtn.setAttribute("appearance", this.props.appearance || "primary");
      copyBtn.setAttribute("size", getButtonSize(this.props.size) || "m");
      copyBtn.setAttribute("shape", this.props.shape || "curved");
    }

    // Set and highlight code
    if (this.props.code && this.hljs) {
      const codeEl = container.querySelector("code");
      codeEl.textContent = this.props.code;
      codeEl.className = `language-${this.props.language || "plaintext"}`;
      this.hljs.highlightElement(codeEl);
    }
  }
}

customElements.define("app-code-block", AppCodeBlockComponent);
