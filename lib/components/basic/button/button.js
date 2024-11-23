/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import buttonCssTemplate from "./button.css";
import buttonHtmlTemplate from "./button.html";

// Centralize configuration constants
const TIPPY_CONFIG = {
  APPEARANCES: ["primary", "secondary", "tertiary", "outlined", "mono"],
  SIZES: ["xs", "s", "m", "l", "xl"],
  SHAPES: ["rounded", "curved", "rectangle"],
  ANIMATIONS: ["fade", "shift-away", "shift-toward", "scale"],
  POSITIONS: ["top", "bottom", "left", "right", "top-start", "top-end", "bottom-start", "bottom-end"],
  TRIGGERS: ["click", "mouseenter", "focus", "manual"],
};

// Load dependencies with improved error handling
const loadDependencies = async () => {
  try {
    // Load Popper.js
    await new Promise((resolve, reject) => {
      if (window.Popper) {
        resolve();
        return;
      }
      const popperScript = document.createElement("script");
      popperScript.src = "https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.8/umd/popper.min.js";
      popperScript.onload = resolve;
      popperScript.onerror = reject;
      document.head.appendChild(popperScript);
    });

    // Load Tippy.js
    await new Promise((resolve, reject) => {
      if (window.tippy) {
        resolve();
        return;
      }
      const tippyScript = document.createElement("script");
      tippyScript.src = "https://cdnjs.cloudflare.com/ajax/libs/tippy.js/6.3.7/tippy.umd.min.js";
      tippyScript.onload = resolve;
      tippyScript.onerror = reject;
      document.head.appendChild(tippyScript);
    });

    return window.tippy;
  } catch (error) {
    console.error("Failed to load dependencies:", error);
    return null;
  }
};

export class AppButtonComponent extends HTMLElement {
  constructor(
    props = {
      // Button props
      id: "button",
      appearance: "primary",
      size: "m",
      shape: "curved",
      style: "",
      loading: false,
      disabled: false,
      label: "",
      title: "",
      "icon-left": "",
      "icon-right": "",
      href: "",
      type: "button",
      // Tooltip props
      tooltip: "",
      "tooltip-appearance": "", // Will inherit from button appearance if not specified
      "tooltip-size": "", // Will inherit from button size if not specified
      "tooltip-shape": "", // Will inherit from button shape if not specified
      "tooltip-position": "top",
      "tooltip-html": "",
      "tooltip-animation": "fade",
      "tooltip-delay": 0,
      "tooltip-duration": 200,
      "tooltip-trigger": "click",
      "tooltip-interactive": false,
      "tooltip-max-width": 350,
      "tooltip-offset": [0, 10],
      "tooltip-arrow": true,
      "tooltip-class": "",
    },
    basePath = "/components/base/button",
    templateHtml = buttonHtmlTemplate,
    templateStyleUrls = [buttonCssTemplate],
  ) {
    super();

    this.props = props;
    this.basePath = basePath;
    this.templateHtml = templateHtml;
    this.templateStyleUrls = templateStyleUrls;
    this.tippyInstance = null;
    this.tippy = null;

    this.init();
  }

  async init() {
    try {
      this.tippy = await loadDependencies();
      await setComponentTemplate.call(
        this,
        () => {
          this.render();
          this.initializeTippy();
        },
        () => {
          console.error("Initial setup for app-button failed!");
        },
      );
    } catch (error) {
      console.error("Failed to initialize button component:", error);
    }
  }

  connectedCallback() {
    if (this.tippy && this.shadowRoot) {
      this.initializeTippy();
    }
  }

  disconnectedCallback() {
    this.destroyTippy();
  }

  static get observedAttributes() {
    return [
      // Button attributes
      "id",
      "appearance",
      "size",
      "shape",
      "style",
      "loading",
      "disabled",
      "label",
      "icon-left",
      "icon-right",
      "type",
      "href",
      "title",
      // Tooltip attributes
      "tooltip",
      "tooltip-appearance",
      "tooltip-size",
      "tooltip-shape",
      "tooltip-position",
      "tooltip-html",
      "tooltip-animation",
      "tooltip-delay",
      "tooltip-duration",
      "tooltip-trigger",
      "tooltip-interactive",
      "tooltip-max-width",
      "tooltip-offset",
      "tooltip-arrow",
      "tooltip-class",
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || newValue === null) return;

    this.props[name] = newValue;
    this.render();

    // Update tippy if the changed attribute affects tooltip
    if (name === "appearance" || name === "size" || name === "shape" || name.startsWith("tooltip-")) {
      this.updateTippy();
    }
  }

  validateTooltipProps() {
    const {
      appearance,
      size,
      shape,
      "tooltip-appearance": tooltipAppearance,
      "tooltip-size": tooltipSize,
      "tooltip-shape": tooltipShape,
      "tooltip-position": position,
      "tooltip-animation": animation,
      "tooltip-trigger": trigger,
    } = this.props;

    return {
      appearance: TIPPY_CONFIG.APPEARANCES.includes(tooltipAppearance) ? tooltipAppearance : appearance || "primary",
      size: TIPPY_CONFIG.SIZES.includes(tooltipSize) ? tooltipSize : size || "m",
      shape: TIPPY_CONFIG.SHAPES.includes(tooltipShape) ? tooltipShape : shape || "curved",
      position: TIPPY_CONFIG.POSITIONS.includes(position) ? position : "top",
      animation: TIPPY_CONFIG.ANIMATIONS.includes(animation) ? animation : "fade",
      trigger: TIPPY_CONFIG.TRIGGERS.includes(trigger) ? trigger : "click",
    };
  }

  getTippyConfig() {
    const validatedProps = this.validateTooltipProps();
    const tooltipClasses = [`tippy-${validatedProps.appearance}`, `tippy-${validatedProps.size}`, `tippy-${validatedProps.shape}`];

    if (this.props["tooltip-class"]) {
      tooltipClasses.push(this.props["tooltip-class"]);
    }

    return {
      content: this.props["tooltip-html"] || this.props.tooltip,
      allowHTML: true,
      placement: validatedProps.position || "auto",
      theme: validatedProps.appearance,
      trigger: validatedProps["tooltip-trigger"] || "click",
      duration: null,
      interactive: true,
      arrow: true,
      appendTo: () => this.shadowRoot,
      interactiveDebounce: 75,
      hideOnClick: validatedProps.trigger === "click",
      onCreate: (instance) => {
        instance.popper.classList.add(...tooltipClasses);
      },
      onShow: (instance) => {
        // Hide all other tooltips except the current one
        if (this.tippy) {
          this.tippy.hideAll({ exclude: instance });
        }
      },
    };
  }

  parseOffset(offset) {
    if (typeof offset === "string") {
      try {
        return JSON.parse(offset);
      } catch {
        return [0, 10];
      }
    }
    return offset || [0, 10];
  }

  destroyTippy() {
    if (this.tippyInstance) {
      this.tippyInstance.destroy();
      this.tippyInstance = null;
    }
  }

  initializeTippy() {
    if (!this.tippy || !this.shadowRoot) return;

    const button = this.shadowRoot.querySelector("#button");
    if (!button || (!this.props.tooltip && !this.props["tooltip-html"])) return;

    this.destroyTippy();
    this.tippyInstance = this.tippy(button, this.getTippyConfig());
  }

  updateTippy() {
    if (!this.tippyInstance) {
      this.initializeTippy();
      return;
    }

    const newConfig = this.getTippyConfig();
    this.tippyInstance.setProps(newConfig);
  }

  getElement() {
    if (!this.shadowRoot) return null;

    const element = this.shadowRoot.querySelector("#button");
    if (element) element.remove();

    const button = document.createElement("button");
    button.classList.add("button");
    button.setAttribute("id", "button");
    button.innerHTML = "";

    this.shadowRoot.appendChild(button);
    return button;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#button-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  render() {
    this.props = getComponentProps.call(this, this.props);
    const button = this.getElement();

    if (button && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply attributes to button
      Object.keys(this.props).forEach((key) => {
        const value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "disabled") {
            button.toggleAttribute("disabled", value === "true" || value === true);
          } else if (["id", "style"].includes(key)) {
            button.setAttribute(key, value);
          } else if (key === "label") {
            const clone = itemTemplate.querySelector("#button-label");
            clone.innerText = value;
            if (!clone.hasAttribute("title")) {
              clone.setAttribute("title", value);
            }
          } else if (key === "title") {
            const labelElement = itemTemplate.querySelector("#button-label");
            if (labelElement) {
              labelElement.setAttribute("title", value);
            }
          } else if (["icon-left", "icon-right"].includes(key)) {
            const clone = itemTemplate.querySelector(`#button-${key}`);
            if (clone) {
              value.split(" ").forEach((className) => clone.classList.add(className));
            }
          } else if (!key.startsWith("tooltip-")) {
            button.setAttribute(`data-${key}`, value);
          }
        } else if (["label", "icon-left", "icon-right"].includes(key)) {
          const element = itemTemplate.querySelector(`#button-${key}`);
          if (element) {
            element.remove();
          }
        }
      });

      // Handle link type
      if (this.props.type === "link" && !isEmptyValue(this.props.href)) {
        button.addEventListener("click", () => {
          const newWindow = window.open(this.props.href, "_blank", "noopener,noreferrer");
          if (newWindow) {
            newWindow.opener = null;
          }
        });
      }

      // Handle loading state
      if (this.props.loading === "true") {
        const loadingAnimationContainer = document.createElement("div");
        loadingAnimationContainer.setAttribute("id", "loader-container");
        loadingAnimationContainer.setAttribute("data-size", this.props.size);

        const loadingAnimation = document.createElement("div");
        loadingAnimation.setAttribute("id", "loader");
        loadingAnimation.setAttribute("data-appearance", this.props.appearance);
        loadingAnimation.setAttribute("data-size", this.props.size);
        loadingAnimation.setAttribute("disabled", "true");

        loadingAnimationContainer.appendChild(loadingAnimation);
        button.innerHTML = "";
        button.appendChild(loadingAnimationContainer);
      } else {
        button.innerHTML = "";
        button.appendChild(itemTemplate);
      }

      this.updateTippy();
    }
  }
}

customElements.define("app-button", AppButtonComponent);
