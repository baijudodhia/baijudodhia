class AppTimelineComponent extends HTMLElement {
  constructor(
    props = {
      items: [],
    },
    basePath = "/components/core/timeline",
    templateUrl = "/components/core/timeline/timeline.html",
    templateStyleUrls = ["/assets/styles/index.css", "/components/core/timeline/timeline.css"],
  ) {
    super();

    this.props = props;
    this.basePath = basePath;
    this.templateUrl = templateUrl;
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

customElements.define("app-timeline", AppTimelineComponent);
