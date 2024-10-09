class AppButtonComponent extends HTMLElement {
  constructor(
    props = {
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
    },
    basePath = "/components/base/button",
    templateHtml = /* HTML */ `
      <button
        id="button"
        class="button"
      >
      </button>

      <template id="button-template">
        <i
          id="button-icon-left"
          aria-hidden="true"
        ></i>
        <div id="button-label"></div>
        <i
          id="button-icon-right"
          aria-hidden="true"
        ></i>
      </template>
    `,
    templateStyleUrls = [
      "/assets/styles/index.css",
      `
    /* Common Styles for Button */
button {
  align-content: center;
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  transition: all 0.3s ease;
  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  box-shadow: none;
  background-color: transparent;
}

button > *:not(:last-child) {
  margin-right: 0.5rem;
}

/* Primary Button Styles */
button[data-appearance="primary"] {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-primary-text);
  box-shadow: 0px 2px 10px -4px var(--color-primary);
}
button[data-appearance="primary"]:not([disabled]):hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}
button[data-appearance="primary"]:not([disabled]):active {
  background-color: var(--color-primary-active);
  border-color: var(--color-primary-active);
}

/* Secondary Button Styles */
button[data-appearance="secondary"] {
  background-color: var(--color-secondary);
  border-color: var(--color-secondary);
  color: var(--color-secondary-text);
  box-shadow: 0px 1px 10px -6px var(--color-secondary);
}
button[data-appearance="secondary"]:not([disabled]):hover {
  background-color: var(--color-secondary-hover);
  border-color: var(--color-secondary-hover);
}
button[data-appearance="secondary"]:not([disabled]):active {
  background-color: var(--color-secondary-active);
  border-color: var(--color-secondary-active);
}

/* Tertiary Button Styles */
button[data-appearance="tertiary"] {
  background-color: var(--color-tertiary);
  border-color: var(--color-tertiary);
  color: var(--color-tertiary-text);
  box-shadow: 0px 1px 10px -6px var(--color-tertiary);
}
button[data-appearance="tertiary"]:not([disabled]):hover {
  background-color: var(--color-tertiary-hover);
  border-color: var(--color-tertiary-hover);
}
button[data-appearance="tertiary"]:not([disabled]):active {
  background-color: var(--color-tertiary-active);
  border-color: var(--color-tertiary-active);
}

/* Outlined Button Styles */
button[data-appearance="outlined"] {
  color: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0px 1px 10px -6px var(--color-primary);
}
button[data-appearance="outlined"]:not([disabled]):hover {
  color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}
button[data-appearance="outlined"]:not([disabled]):active {
  color: var(--color-primary-active);
  border-color: var(--color-primary-active);
}

/* Mono Button Styles */
button[data-appearance="mono"] {
  color: var(--color-primary);
}
button[data-appearance="mono"]:not([disabled]):hover {
  color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}
button[data-appearance="mono"]:not([disabled]):active {
  color: var(--color-primary-active);
  border-color: var(--color-primary-active);
}

/* Link Button Styles */
button[data-appearance="link"] {
  color: var(--color-primary);
  padding: 0rem !important;
  cursor: pointer;

  text-decoration: underline;
  text-underline-position: under;
  text-decoration-style: dashed;
  text-decoration-color: var(--color-primary);
}
button[data-appearance="link"]:not([disabled]):hover {
  color: var(--color-primary-hover);
  text-decoration-style: solid;
  text-decoration-color: var(--color-primary-hover);
}
button[data-appearance="link"]:not([disabled]):active {
  color: var(--color-primary-active);
  text-decoration-style: dashed;
  text-decoration-color: var(--color-primary-active);
}

/* Button Sizes */
button[data-size="xs"] {
  padding: var(--space-xxs);
  font-size: var(--font-size-xs);
  line-height: var(--font-size-xs);
  height: calc((2 * var(--space-xxs)) + var(--font-size-xs));
}
button[data-size="s"] {
  padding: var(--space-xs);
  font-size: var(--font-size-s);
  line-height: var(--font-size-s);
  height: calc((2 * var(--space-xs)) + var(--font-size-s));
}
button[data-size="m"] {
  padding: var(--space-s);
  font-size: var(--font-size-m);
  line-height: var(--font-size-m);
  height: calc((2 * var(--space-s)) + var(--font-size-m));
}
button[data-size="l"] {
  padding: var(--space-m);
  font-size: var(--font-size-l);
  line-height: var(--font-size-l);
  height: calc((2 * var(--space-m)) + var(--font-size-l));
}
button[data-size="xl"] {
  padding: var(--space-l);
  font-size: var(--font-size-xl);
  line-height: var(--font-size-xl);
  height: calc((2 * var(--space-l)) + var(--font-size-xxl));
}

/* Button Shapes */
button[data-shape="rounded"] {
  border-radius: 2rem;
}
button[data-shape="curved"] {
  border-radius: 0.5rem;
}
button[data-shape="rectangle"] {
  border-radius: 0rem;
}

/* Loading Animation Styles */
@keyframes spinAnimation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Loader Appearance */
/* Loader Size */
button > #loader-container[data-size="xs"] {
  font-size: var(--font-size-xs);
  line-height: var(--font-size-xs);
  width: var(--font-size-xs);
  height: var(--font-size-xs);
}
button > #loader-container[data-size="s"] {
  font-size: var(--font-size-s);
  line-height: var(--font-size-s);
  width: var(--font-size-s);
  height: var(--font-size-s);
}
button > #loader-container[data-size="m"] {
  font-size: var(--font-size-m);
  line-height: var(--font-size-m);
  width: var(--font-size-m);
  height: var(--font-size-m);
}
button > #loader-container[data-size="l"] {
  font-size: var(--font-size-l);
  line-height: var(--font-size-l);
  width: var(--font-size-l);
  height: var(--font-size-l);
}
button > #loader-container[data-size="xl"] {
  font-size: var(--font-size-xl);
  line-height: var(--font-size-xl);
  width: var(--font-size-xl);
  height: var(--font-size-xl);
}

button #loader {
  border-radius: 100%;
  animation: spinAnimation 1s linear infinite;
}
button #loader[data-appearance="primary"] {
  border-bottom: 2px solid var(--color-primary-text);
  border-left: 2px solid var(--color-primary);
  border-right: 2px solid var(--color-primary);
  border-top: 2px solid var(--color-primary);
}
button #loader[data-appearance="secondary"] {
  border-bottom: 2px solid var(--color-secondary-text);
  border-left: 2px solid var(--color-secondary);
  border-right: 2px solid var(--color-secondary);
  border-top: 2px solid var(--color-secondary);
}
button #loader[data-appearance="tertiary"] {
  border-bottom: 2px solid var(--color-tertiary-text);
  border-left: 2px solid var(--color-tertiary);
  border-right: 2px solid var(--color-tertiary);
  border-top: 2px solid var(--color-tertiary);
}
button #loader[data-appearance="outlined"] {
  border-bottom: 2px solid var(--color-primary);
  border-left: 2px solid transparent;
  border-right: 2px solid transparent;
  border-top: 2px solid transparent;
}
button #loader[data-appearance="mono"] {
  border-bottom: 2px solid var(--color-primary);
  border-left: 2px solid transparent;
  border-right: 2px solid transparent;
  border-top: 2px solid transparent;
}
button #loader[data-appearance="link"] {
  border-bottom: 2px solid var(--color-primary);
  border-left: 2px solid transparent;
  border-right: 2px solid transparent;
  border-top: 2px solid transparent;
}

/* Loader Size */
button #loader[data-size="xs"] {
  width: calc(1 * var(--font-size-xs));
  height: calc(1 * var(--font-size-xs));
  line-height: calc(1 * var(--font-size-xs));
}
button #loader[data-size="s"] {
  width: calc(1.5 * var(--font-size-s));
  height: calc(1.5 * var(--font-size-s));
  line-height: calc(1.5 * var(--font-size-s));
}
button #loader[data-size="m"] {
  width: calc(1.5 * var(--font-size-m));
  height: calc(1.5 * var(--font-size-m));
  line-height: calc(1.5 * var(--font-size-m));
}
button #loader[data-size="l"] {
  width: calc(1.5 * var(--font-size-l));
  height: calc(1.5 * var(--font-size-l));
  line-height: calc(1.5 * var(--font-size-l));
}
button #loader[data-size="xl"] {
  width: calc(1.5 * var(--font-size-xl));
  height: calc(1.5 * var(--font-size-xl));
  line-height: calc(1.5 * var(--font-size-xl));
}

/* Add Loading Animation Styles for different appearances and sizes as needed */

/* Button Template Sizes */
button[data-size="xs"] > #button-icon-left,
button[data-size="xs"] > #button-icon-right,
button[data-size="xs"] > #button-label {
  font-size: var(--font-size-xs) !important;
}
button[data-size="s"] > #button-icon-left,
button[data-size="s"] > #button-icon-right,
button[data-size="s"] > #button-label {
  font-size: var(--font-size-s) !important;
}
button[data-size="m"] > #button-icon-left,
button[data-size="m"] > #button-icon-right,
button[data-size="m"] > #button-label {
  font-size: var(--font-size-m) !important;
}
button[data-size="l"] > #button-icon-left,
button[data-size="l"] > #button-icon-right,
button[data-size="l"] > #button-label {
  font-size: var(--font-size-l) !important;
}
button[data-size="xl"] > #button-icon-left,
button[data-size="xl"] > #button-icon-right,
button[data-size="xl"] > #button-label {
  font-size: var(--font-size-xl) !important;
}
    `,
      "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css",
    ],
  ) {
    super();

    this.props = props;
    this.basePath = basePath;
    this.templateHtml = templateHtml;
    this.templateStyleUrls = templateStyleUrls;

    // Initialize debounceTimeout as a class property
    this.debounceTimeout = null;

    setComponentTemplate.call(
      this,
      () => {
        console.log("Initial setup successfull!");
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
    return [
      "id",
      "appearance",
      "size",
      "shape",
      "styles",
      "loading",
      "style",
      "disabled",
      "label",
      "icon-left",
      "icon-right",
      "type",
      "href",
      "title",
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && newValue) {
      this.props[name] = newValue;

      // Clear the previous timeout if it exists
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }

      // Set a new timeout
      this.debounceTimeout = setTimeout(() => {
        this.render();
        // Clear the timeout variable after the render
        this.debounceTimeout = null;
      }, 1000); // Adjust the delay (in milliseconds) as needed
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

    const element = this.shadowRoot.querySelector("button");
    if (element) {
      element.remove();
    }

    let button = document.createElement("button");
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
    const button = this.getElement(this.props.type);

    console.count("Rendering: ", button);

    if (button && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the button element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "disabled") {
            if (value) {
              button.setAttribute(key);
            } else {
              button.removeAttribute(key);
            }
          } else if (key === "id") {
            button.setAttribute(`${key}`, value);
          } else if (key === "style") {
            button.setAttribute(`${key}`, value);
          } else if (key === "label") {
            const clone = itemTemplate.querySelector("#button-label");
            clone.innerText = value;
            if (!clone.hasAttribute("title")) {
              clone.setAttribute("title", value);
            }
          } else if (key === "title") {
            const clone = itemTemplate.querySelector("#button-label");
            clone.setAttribute("title", value);
          } else if (key === "icon-left") {
            const clone = itemTemplate.querySelector("#button-icon-left");
            value.split(" ").forEach((className) => {
              clone.classList.add(className);
            });
          } else if (key === "icon-right") {
            const clone = itemTemplate.querySelector("#button-icon-right");
            value.split(" ").forEach((className) => {
              clone.classList.add(className);
            });
          } else {
            button.setAttribute(`data-${key}`, value);
          }
        } else {
          // Remove specific elements from the template if the value is empty
          if (key === "label" || key === "icon-left" || key === "icon-right") {
            itemTemplate.querySelector(`#button-${key}`).remove();
          }
        }
      });

      if (this.props.type === "link" && !isEmptyValue(this.props.href)) {
        // Add click listener to open external link
        button.addEventListener("click", () => {
          window.open(this.props.href, "_blank");
        });
      }

      if (this.props.loading === "true") {
        // Render loading animations
        const loadingAnimationContainer = document.createElement("div");
        loadingAnimationContainer.setAttribute("id", "loader-container");

        const loadingAnimation = document.createElement("div");
        loadingAnimation.setAttribute("id", "loader");
        loadingAnimation.setAttribute("data-appearance", this.props.appearance);
        loadingAnimation.setAttribute("data-size", this.props.size);
        loadingAnimation.setAttribute("disabled", true);

        loadingAnimationContainer.appendChild(loadingAnimation.cloneNode(true));

        button.innerHTML = ""; // Clear existing content
        button.appendChild(loadingAnimationContainer.cloneNode(true));
      } else {
        // Render children
        button.innerHTML = ""; // Clear existing content
        button.appendChild(itemTemplate);
      }
    }
  }
}

customElements.define("app-button", AppButtonComponent);
