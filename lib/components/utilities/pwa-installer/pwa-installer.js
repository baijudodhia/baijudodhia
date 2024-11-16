// Define the custom element class
/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import pwaInstallerCssTemplate from "./pwa-installer.css";
import pwaInstallerHtmlTemplate from "./pwa-installer.html";

class AppPwaInstaller extends HTMLElement {
  constructor(
    props = {
      id: "pwaInstaller",
      color: "",
    },
    basePath = "/components/core/pwa-installer",
    templateHtml = pwaInstallerHtmlTemplate,
    templateStyleUrls = [pwaInstallerCssTemplate],
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
        console.log("Initial setup for app-pwa-installer failed!");
      },
    );
  }

  connectedCallback() {
    // Create the button element
    const pwa_button = document.createElement("app-button");
    pwa_button.setAttribute("icon-right", "fa fa-download");
    pwa_button.setAttribute("label", "Install App");
    pwa_button.setAttribute("title", "Install Baiju Dodhia's Portfolio as an Application");
    pwa_button.setAttribute("size", "s");
    pwa_button.setAttribute("appearance", "outlined");
    pwa_button.setAttribute("type", "button");
    pwa_button.setAttribute("loading", "true");
    pwa_button.setAttribute("style", "display: none"); // Hide the button by default

    // Add click event listener to show installation prompt
    pwa_button.addEventListener("click", () => {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt(); // Show installation prompt
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the A2HS prompt");
          } else {
            console.log("User dismissed the A2HS prompt");
          }
          this.deferredPrompt = null; // Reset the prompt
        });
      }
    });

    // Append the button to the custom element
    this.appendChild(pwa_button);

    // Store the deferred prompt for later use
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      this.deferredPrompt = event;

      pwa_button.setAttribute("style", "display: inline-flex"); // Show the button when prompt is available
      pwa_button.setAttribute("loading", "false"); // Show the button when prompt is available
    });
  }

  getElement() {
    if (!this.shadowRoot) {
      return null;
    }

    const element = this.shadowRoot.querySelector("#pwa-installer");
    if (element) {
      element.remove();
    }

    let pwaInstaller = document.createElement("div");
    pwaInstaller.classList.add("pwa-installer");
    pwaInstaller.setAttribute("id", "pwa-installer");
    pwaInstaller.innerHTML = "";

    this.shadowRoot.appendChild(pwaInstaller);

    return pwaInstaller;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#pwa-installer-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  // there can be other element methods and properties
  render() {
    this.props = getComponentProps.call(this, this.props);
    const pwaInstaller = this.getElement();

    if (pwaInstaller && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the pwaInstaller element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "color") {
            const color_changer = this.shadowRoot.getElementById("pwa-installer-input");
            color_changer.value = window.HSLToHex(getComputedStyle(document.documentElement, null).getPropertyValue("--color-primary"));
          } else if (key === "id") {
            pwaInstaller.setAttribute(`${key}`, value);
          }
        }
      });

      // Render children
      pwaInstaller.innerHTML = ""; // Clear existing content
      pwaInstaller.appendChild(itemTemplate);
    }
  }
}

// Define the custom element
customElements.define("app-pwa-installer", AppPwaInstaller);
