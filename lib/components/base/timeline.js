/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */

import { getComponentProps, setComponentTemplate } from "../../utils/index.js";

class AppTimelineComponent extends HTMLElement {
  constructor(
    props = {
      id: "timeline",
      items: [],
    },
    basePath = "/components/base/timeline",

    templateHtml = `
      <div
        id="timeline"
        class="timeline"
      >
      </div>

      <template id="timeline-item-template">
        <li class="timeline-item">
          <div class="timeline-item-line"></div>
          <div class="timeline-item-content"></div>
        </li>
      </template>
    `,
    templateStyleUrls = [
      `#timeline {
  margin-left: 0.5em;
  padding-left: 1em;
}

#timeline.single-child,
#timeline.single-child > .timeline-item {
  margin: 0rem !important;
  padding: 0rem !important;
  list-style: none !important;
}

.timeline-item {
  position: relative;
  list-style-type: circle;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.timeline-item:first-child {
  margin-top: 0rem;
}

.timeline-item:last-child {
  margin-bottom: 0rem;
}

.timeline-item:after {
  content: "";
  position: absolute;
  top: 1.5rem;
  left: -1rem;
  width: 0px;
  height: calc(100% - 0.25rem);
  border-right-width: 2px;
  border-right-style: dashed;
  border-right-color: var(--color-bw-text);
}

.timeline-item:last-child:after {
  display: none;
}

.timeline-item-line {
  position: absolute;
  top: 0px;
  height: 0px;
}
`,
      "/lib/styles/index.css",
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

  connectedCallback() {}

  disconnectedCallback() {}

  static get observedAttributes() {
    return ["items"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && newValue) {
      this.props[name] = newValue;
      this.render();
    }
  }

  adoptedCallback() {}

  getElement() {
    if (!this.shadowRoot) {
      return null;
    }

    const element = this.shadowRoot.querySelector("#timeline");
    if (element) {
      element.remove();
    }

    let timeline = document.createElement("ul");
    timeline.classList.add("timeline");
    timeline.setAttribute("id", "timeline");
    timeline.innerHTML = "";

    this.shadowRoot.appendChild(timeline);

    return timeline;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#timeline-item-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  render() {
    this.props = getComponentProps.call(this, this.props);

    const element = this.getElement();
    const template = this.getTemplate();
    const children = Array.from(this.children);

    if (element && "content" in document.createElement("template")) {
      children.forEach((child) => {
        const clone = this.getTemplateClone(template);

        clone.querySelector(".timeline-item-content").innerHTML = child.outerHTML;

        element.appendChild(clone);
      });

      if (children.length === 1) {
        element.classList.add("single-child");
      }
    }
  }
}

customElements.define("app-timeline", AppTimelineComponent);
