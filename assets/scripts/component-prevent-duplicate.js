let existingUrl = {}; // Cache for storing the fetched content
let urlPromises = {}; // Cache promises per URL to avoid duplicate fetch requests
let queues = {}; // Queues per URL to manage waiting requests

async function setComponentTemplate(success, error) {
  // Function to execute the template URL fetch
  async function setTemplateUrl() {
    console.log("Inside setTemplateUrl", this.props.id, existingUrl);
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
    }

    try {
      const res = await fetch(finalUrl); // Fetch the resource
      if (res.ok) {
        const html = await res.text(); // Parse the response as HTML
        console.log("Fetch successful for:", this.props.id, existingUrl);
        existingUrl[this.props.id] = html; // Cache the fetched HTML content

        // Call all success callbacks in the queue for this URL
        queues[finalUrl].forEach((callback) => {
          this.template.innerHTML = html;

          console.log("TIMELINE LOOPING", this.shadowRoot);

          if (!this.shadowRoot) {
            setShadowDOM.call(this, callback);
          } else {
            callback.success();
          }
        });
        queues[finalUrl] = []; // Clear the queue after processing
      } else {
        console.log("Fetch failed for:", this.props.id, existingUrl);
        throw new Error("Failed to load template");
      }
    } catch (err) {
      console.error("Fetch error for:", this.props.id, err);
      queues[finalUrl].forEach((callback) => callback.error()); // Call all error callbacks
      queues[finalUrl] = []; // Clear the queue after processing
    }
  }

  function setShadowDOM(callback) {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    setTemplateStyleUrls.call(this, callback);
  }

  function setTemplateStyleUrls(callback) {
    this.templateStyleUrls.forEach((style) => {
      const cdn_domain = localStorage.getItem("cdn_domain");
      const hostname = window.location.hostname;

      let finalUrl = style;
      if (cdn_domain && !style.includes("http") && !hostname.includes("localhost") && !hostname.includes("127.0.0.1")) {
        finalUrl = `${cdn_domain}${style}`;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = finalUrl;
      this.shadowRoot.appendChild(link);
    });

    callback.success();
  }

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
  }

  console.log("Initial load for:", this.props.id, existingUrl);
  if (!existingUrl[this.props.id]) {
    console.log("No data cached for:", this.props.id, existingUrl);

    // Initialize a queue for the specific URL if not already done
    if (!queues[finalUrl]) {
      queues[finalUrl] = [];
    }

    queues[finalUrl].push({ success, error }); // Add to queue for the specific URL

    // If there's no existing promise for the URL, start the fetch
    if (!urlPromises[finalUrl]) {
      console.log("No promise, starting fetch for:", this.props.id, existingUrl);
      urlPromises[finalUrl] = setTemplateUrl.call(this).finally(() => {
        urlPromises[finalUrl] = null; // Clear the promise for this URL after it resolves
      });
      await urlPromises[finalUrl]; // Wait for the specific promise to resolve
    } else {
      console.log("Waiting for existing promise for:", this.props.id, existingUrl);
      await urlPromises[finalUrl]; // Wait for an existing fetch promise for this URL
    }
  } else {
    console.log("Using cached data for:", this.props.id, existingUrl);
    success(existingUrl[this.props.id]); // Use cached data
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
