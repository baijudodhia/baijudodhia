let cache = {};

async function setComponentTemplate(success, error) {
  async function setTemplateUrl() {
    this.template = document.createElement("template");

    const cdn_domain = localStorage.getItem("cdn_domain");
    let finalUrl = this.templateUrl;
    if (cdn_domain !== "" && cdn_domain !== undefined && cdn_domain !== null && !style.includes("http")) {
      finalUrl = `${cdn_domain}${this.templateUrl}`;
    } else {
      finalUrl = this.templateUrl;
    }

    try {
      let _cache = cache[finalUrl];

      if (!_cache) {
        const response = await fetch(finalUrl);
        const html = await response.text();
        this.template.innerHTML = html;
        cache[finalUrl] = html;
      } else {
        this.template.innerHTML = _cache;
      }

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
      const cdn_domain = localStorage.getItem("cdn_domain");
      let finalUrl = style;
      if (cdn_domain !== "" && cdn_domain !== undefined && cdn_domain !== null && !style.includes("http")) {
        finalUrl = `${cdn_domain}${style}`;
      } else {
        finalUrl = style;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = finalUrl;
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
