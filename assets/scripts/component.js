let templatecache = {};
let styleCache = {};

async function setComponentTemplate(success, error) {
  async function setTemplateHtml() {
    this.template = document.createElement("template");

    this.template.innerHTML = this.templateHtml;

    setShadowDOM.call(this);
  }

  async function setTemplateHtmlUrl() {
    this.template = document.createElement("template");

    const cdn_domain = localStorage.getItem("cdn_domain");
    const hostname = window.location.hostname;

    let finalUrl = this.templateUrl;
    if (
      cdn_domain &&
      !this.templateUrl.includes("http") &&
      !hostname.includes("localhost") &&
      !hostname.includes("127.0.0.1")
    ) {
      finalUrl = `${cdn_domain}${this.templateUrl}`;
    } else {
      finalUrl = this.templateUrl;
    }

    try {
      let _templateCache = templateCache[finalUrl];

      if (!_templateCache) {
        const response = await fetch(finalUrl);
        const html = await response.text();
        this.template.innerHTML = html;
        templateCache[finalUrl] = html;
      } else {
        this.template.innerHTML = _templateCache;
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
    this.templateStyleUrls.forEach(async (style) => {
      const cdn_domain = localStorage.getItem("cdn_domain");
      const hostname = window.location.hostname;

      let finalUrl = style;

      // Check if the style is a URL
      if (typeof style === "string" && style.endsWith(".css")) {
        if (
          cdn_domain &&
          !hostname.includes("localhost") &&
          !hostname.includes("127.0.0.1") &&
          !hostname.includes("http")
        ) {
          finalUrl = `${cdn_domain}${style}`;
        } else {
          finalUrl = style;
        }

        // Check if the style is already cached
        let cachedStyle = styleCache[finalUrl];

        if (!cachedStyle) {
          try {
            const response = await fetch(finalUrl);
            cachedStyle = await response.text();
            styleCache[finalUrl] = cachedStyle; // Store in cache
          } catch (error) {
            console.error("Error fetching stylesheet:", error);
            return; // Exit if fetching fails
          }
        }

        // Create a link element for stylesheets
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = finalUrl;
        this.shadowRoot.appendChild(link);
      } else {
        // Create a style element for inline styles
        const styleElement = document.createElement("style");
        styleElement.textContent = style; // Assuming it's a template literal or a string of CSS
        this.shadowRoot.appendChild(styleElement);
      }
    });

    success();
  }

  if (!isEmptyValue(this.templateUrl)) {
    setTemplateHtmlUrl.call(this);
  } else if (!isEmptyValue(this.templateHtml)) {
    setTemplateHtml.call(this);
  }
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
