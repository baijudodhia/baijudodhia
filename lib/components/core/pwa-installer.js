// Define the custom element class
class AppPwaInstaller extends HTMLElement {
  constructor() {
    super();
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
}

// Define the custom element
customElements.define("app-pwa-installer", AppPwaInstaller);
