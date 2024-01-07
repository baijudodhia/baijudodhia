async function setComponentTemplate(success, error) {
  async function setTemplateUrl() {
    this.template = document.createElement("template");

    try {
      const response = await fetch(this.templateUrl);
      const html = await response.text();
      this.template.innerHTML = html;

      setShadowDOM.call(this);
    } catch (error) {
      console.error("Error fetching or setting up template:", error);
    }
  }

  function setShadowDOM() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));

    setTemplateStyleUrls.call(this);
  }

  function setTemplateStyleUrls() {
    this.templateStyleUrls.forEach((style) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = style;
      this.shadowRoot.appendChild(link);
    });

    success();
  }

  setTemplateUrl.call(this);
}

function getComponentProps(props) {
  Object.keys(props).forEach((key) => {
    const attributeValue = this.getAttribute(key);

    if (!isEmptyValue(attributeValue)) {
      props[key] = this.getAttribute(key);
    }
  });

  return props;
}
