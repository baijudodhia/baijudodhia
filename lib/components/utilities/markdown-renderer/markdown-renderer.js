import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import markdownRendererCssTemplate from "./markdown-renderer.css";
import markdownRendererHtmlTemplate from "./markdown-renderer.html";

const loadDependencies = async (props) => {
  try {
    // Load Marked.js
    await new Promise((resolve, reject) => {
      if (window.marked) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.2/marked.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    // Load MathJax
    await new Promise((resolve, reject) => {
      if (window.MathJax) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/mathjax@2.7.9/MathJax.js?config=TeX-MML-AM_CHTML";
      script.onload = () => {
        window.MathJax.Hub.Config({
          tex2jax: {
            inlineMath: [
              ["$", "$"],
              ["\\(", "\\)"],
            ],
            displayMath: [
              ["$$", "$$"],
              ["\\[", "\\]"],
            ],
            processEscapes: true,
          },
          jax: ["input/TeX", "output/HTML-CSS", "output/SVG"], // Specify the input and output formats
          extensions: ["tex2jax.js", "AMSsymbols.js", "autoload.js"], // Load some useful extensions
          "HTML-CSS": {
            availableFonts: ["TeX", "STIX"], // Specify which fonts to use for rendering math
          },
          messageStyle: "none", // Suppress startup messages
        });
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    // Marked.js renderer to handle code blocks
    const renderer = new window.marked.Renderer();
    renderer.code = function (code, language, escaped) {
      const codeBlock = document.createElement("app-code-block");
      codeBlock.setAttribute("code", code);
      if (language) {
        codeBlock.setAttribute("language", language);
        codeBlock.setAttribute("title", language);
      }
      codeBlock.setAttribute("appearance", props?.appearance || "primary");
      codeBlock.setAttribute("size", props?.size || "m");
      codeBlock.setAttribute("shape", props?.shape || "curved");
      return codeBlock.outerHTML;
    };

    window.marked.setOptions({
      gfm: true,
      breaks: true,
      headerIds: true,
      headerPrefix: "heading-",
      mangle: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: true,
      renderer: renderer,
    });

    return { marked: window.marked, MathJax: window.MathJax };
  } catch (error) {
    console.error("Failed to load dependencies:", error);
    return null;
  }
};

export class AppMarkdownRendererComponent extends HTMLElement {
  constructor(
    props = {
      id: "markdown-renderer",
      appearance: "primary",
      size: "m",
      shape: "curved",
      style: "",
      content: "",
    },
    basePath = "/components/utilities/markdown-renderer",
    templateHtml = markdownRendererHtmlTemplate,
    templateStyleUrls = [markdownRendererCssTemplate],
  ) {
    super();

    this.props = props;
    this.basePath = basePath;
    this.templateHtml = templateHtml;
    this.templateStyleUrls = templateStyleUrls;
    this.marked = null;
    this.MathJax = null;

    this.init();
  }

  async init() {
    try {
      const deps = await loadDependencies(this.props);
      if (deps) {
        this.marked = deps.marked;
        this.MathJax = deps.MathJax;
      }
      await setComponentTemplate.call(
        this,
        () => {
          this.render();
        },
        () => {
          console.error("Initial setup for app-markdown-renderer failed!");
        },
      );
    } catch (error) {
      console.error("Failed to initialize markdown renderer:", error);
    }
  }

  static get observedAttributes() {
    return ["id", "appearance", "size", "shape", "style", "content"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && newValue) {
      this.props[name] = newValue;
      this.render();
    }
  }

  getElement() {
    if (!this.shadowRoot) return null;

    const element = this.shadowRoot.querySelector(`#${this.props.id}` || "#markdown-renderer");
    if (element) {
      element.remove();
    }

    const container = document.createElement("div");
    container.classList.add("markdown-renderer");
    container.setAttribute("id", `${this.props.id}` || "markdown-renderer");
    container.innerHTML = "";

    this.shadowRoot.appendChild(container);
    return container;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#markdown-renderer-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  render() {
    if (!this.marked || !this.MathJax) return;

    this.props = getComponentProps.call(this, this.props);
    const container = this.getElement();

    if (container && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      Object.keys(this.props).forEach((key) => {
        const value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "id" || key === "style") {
            container.setAttribute(key, value);
          } else if (key === "content") {
            const contentEl = itemTemplate.querySelector("#markdown-content");
            if (contentEl) {
              // Render Markdown content using Marked.js
              contentEl.innerHTML = this.marked.parse(value);

              // Make sure MathJax finishes processing the content after it's rendered
              this.MathJax.Hub.Queue(["Typeset", this.MathJax.Hub, contentEl]);
            }
          } else {
            container.setAttribute(`data-${key}`, value);
          }
        }
      });

      container.innerHTML = "";
      container.appendChild(itemTemplate);
    }
  }
}

customElements.define("app-markdown-renderer", AppMarkdownRendererComponent);
