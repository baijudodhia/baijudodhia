/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */

import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../utils/index.js";

class AppCardComponent extends HTMLElement {
  constructor(
    props = {
      id: "button",
      appearance: "primary",
      size: "m",
      shape: "curved",
      style: "",
      header: "",
      body: "",
      footer: "",
    },
    basePath = "/components/base/card",

    templateHtml = `
      <div
        id="card"
        class="card"
      >
      </div>

      <template id="card-template">
        <div
          class="card-header"
          id="card-header"
        ></div>
        <div
          class="card-body"
          id="card-body"
        ></div>
        <div
          class="card-footer"
          id="card-footer"
        ></div>
      </template>
    `,
    templateStyleUrls = [
      `:host {
  width: 100%;
  height: auto;
}

/* Common Styles for Button */
#card > * {
  --card-color-text: var(--color-black);
}

#card:hover > * {
  --card-color-text: var(--color-white);
}

#card {
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  box-shadow: none;
  background-color: transparent;
  color: var(--card-color-text);
}

#card > *:not(:last-child) {
  border-bottom-width: 2px;
  border-bottom-style: dashed;
}

/* Primary Card Styles */
#card[data-appearance="primary"] {
  border-color: var(--color-primary);
  box-shadow: 0px 2px 10px -4px var(--color-primary);
}
#card[data-appearance="primary"]:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

/* Secondary Card Styles */
#card[data-appearance="secondary"] {
  border-color: var(--color-secondary);
  box-shadow: 0px 2px 10px -4px var(--color-secondary);
}
#card[data-appearance="secondary"]:hover {
  background-color: var(--color-secondary-hover);
  border-color: var(--color-secondary-hover);
}

/* Tertiary Card Styles */
#card[data-appearance="tertiary"] {
  border-color: var(--color-tertiary);
  box-shadow: 0px 2px 10px -4px var(--color-tertiary);
}
#card[data-appearance="tertiary"]:hover {
  background-color: var(--color-tertiary-hover);
  border-color: var(--color-tertiary-hover);
}

/* Card Sizes */
#card[data-size="xs"] {
  padding: var(--space-xs);
  font-size: var(--font-size-xs);
  line-height: var(--font-size-xs);
}
#card[data-size="xs"] > *:not(:last-child) {
  margin-bottom: var(--space-xs);
  padding-bottom: var(--space-xs);
}
#card[data-size="s"] {
  padding: var(--space-s);
  font-size: var(--font-size-s);
  line-height: var(--font-size-s);
}
#card[data-size="s"] > *:not(:last-child) {
  margin-bottom: var(--space-s);
  padding-bottom: var(--space-s);
}
#card[data-size="m"] {
  padding: var(--space-m);
  font-size: var(--font-size-m);
  line-height: var(--font-size-m);
}
#card[data-size="m"] > *:not(:last-child) {
  margin-bottom: var(--space-m);
  padding-bottom: var(--space-m);
}
#card[data-size="l"] {
  padding: var(--space-l);
  font-size: var(--font-size-l);
  line-height: var(--font-size-l);
}
#card[data-size="l"] > *:not(:last-child) {
  margin-bottom: var(--space-l);
  padding-bottom: var(--space-l);
}
#card[data-size="xl"] {
  padding: var(--space-xl);
  font-size: var(--font-size-xl);
  line-height: var(--font-size-xl);
}
#card[data-size="xl"] > *:not(:last-child) {
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-xl);
}

/* Card Shapes */
#card[data-shape="rounded"] {
  border-radius: 2rem;
}
#card[data-shape="curved"] {
  border-radius: 1rem;
}
#card[data-shape="rectangle"] {
  border-radius: 0rem;
}

#card > #card-header {
}
#card > #card-body {
  flex-grow: 1;
}
#card > #card-footer {
}
`,
      "/lib/styles/index.css",
      "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css",
    ],
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
    return ["id", "appearance", "size", "shape", "style", "header", "body", "footer"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && newValue) {
      this.props[name] = newValue;
      this.render();
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

    const element = this.shadowRoot.querySelector("#card");
    if (element) {
      element.remove();
    }

    let card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("id", "card");
    card.innerHTML = "";

    this.shadowRoot.appendChild(card);

    return card;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#card-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  render() {
    this.props = getComponentProps.call(this, this.props);
    const card = this.getElement(this.props.type);

    if (card && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the card element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          switch (key) {
            case "id":
              break;
            case "header":
              const cardHeaderClone = itemTemplate.querySelector("#card-header");
              cardHeaderClone.innerHTML = value;
              break;
            case "body":
              const cardBodyClone = itemTemplate.querySelector("#card-body");
              cardBodyClone.innerHTML = value;
              break;
            case "footer":
              const cardFooterClone = itemTemplate.querySelector("#card-footer");
              cardFooterClone.innerHTML = value;
              break;
            default:
              card.setAttribute(`data-${key}`, value);
              break;
          }
        } else {
          // Remove specific elements from the template if the value is empty
          switch (key) {
            case "header":
              itemTemplate.querySelector(`#card-${key}`).remove();
              break;
            case "body":
              itemTemplate.querySelector(`#card-${key}`).remove();
              break;
            case "footer":
              itemTemplate.querySelector(`#card-${key}`).remove();
              break;
            default:
              break;
          }
        }
      });

      // Render children
      card.innerHTML = ""; // Clear existing content
      card.appendChild(itemTemplate);
    }
  }
}

customElements.define("app-card", AppCardComponent);
