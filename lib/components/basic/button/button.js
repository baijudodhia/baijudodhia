import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import buttonCssTemplate from "./button.css";
import buttonHtmlTemplate from "./button.html";

// Centralize configuration constants
const BUTTON_CONFIG = {
  APPEARANCES: ["primary", "secondary", "tertiary", "outlined", "mono"],
  SIZES: ["xs", "s", "m", "l", "xl"],
  SHAPES: ["rounded", "curved", "rectangle"],
  TYPES: ["button", "submit", "reset", "link", "pwa-installer"],
  ANIMATIONS: ["fade", "shift-away", "shift-toward", "scale"],
  POSITIONS: ["top", "bottom", "left", "right", "top-start", "top-end", "bottom-start", "bottom-end"],
  TRIGGERS: ["click", "mouseenter", "focus", "manual"],
};

// Load dependencies with improved error handling
const loadDependencies = async () => {
  try {
    // Load Popper.js
    await new Promise((resolve, reject) => {
      if (window.Popper) {
        resolve();
        return;
      }
      const popperScript = document.createElement("script");
      popperScript.src = "https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.8/umd/popper.min.js";
      popperScript.onload = resolve;
      popperScript.onerror = reject;
      document.head.appendChild(popperScript);
    });

    // Load Tippy.js
    await new Promise((resolve, reject) => {
      if (window.tippy) {
        resolve();
        return;
      }
      const tippyScript = document.createElement("script");
      tippyScript.src = "https://cdnjs.cloudflare.com/ajax/libs/tippy.js/6.3.7/tippy.umd.min.js";
      tippyScript.onload = resolve;
      tippyScript.onerror = reject;
      document.head.appendChild(tippyScript);
    });

    return window.tippy;
  } catch (error) {
    console.error("Failed to load dependencies:", error);
    return null;
  }
};

export class AppButtonComponent extends HTMLElement {
  constructor(
    props = {
      // Button props
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
      "icon-element-left": "",
      "icon-element-right": "",
      "icon-only": false,
      href: "",
      download: "",
      rel: "noopener noreferrer",
      "href-target": "_blank",
      type: "button",
      // Form props
      name: "",
      value: "",
      form: "",
      formaction: "",
      formmethod: "",
      formtarget: "",
      formnovalidate: false,
      formenctype: "",
      // PWA props
      "install-text": "",
      // Tooltip props
      tooltip: "",
      "tooltip-appearance": "", // Will inherit from button appearance if not specified
      "tooltip-size": "", // Will inherit from button size if not specified
      "tooltip-shape": "", // Will inherit from button shape if not specified
      "tooltip-position": "top",
      "tooltip-html": "",
      "tooltip-animation": "fade",
      "tooltip-delay": 0,
      "tooltip-duration": 200,
      "tooltip-trigger": "click",
      "tooltip-interactive": false,
      "tooltip-max-width": 350,
      "tooltip-offset": [0, 10],
      "tooltip-arrow": true,
      "tooltip-class": "",
    },
    basePath = "/components/base/button",
    templateHtml = buttonHtmlTemplate,
    templateStyleUrls = [buttonCssTemplate],
  ) {
    super();

    this.props = props;
    this.basePath = basePath;
    this.templateHtml = templateHtml;
    this.templateStyleUrls = templateStyleUrls;
    this.tippyInstance = null;
    this.tippy = null;

    // PWA installer properties
    this.deferredPrompt = null;
    this.platform = this._detectPlatform();

    this.init();
  }

  async init() {
    try {
      this.tippy = await loadDependencies();
      await setComponentTemplate.call(
        this,
        () => {
          this.render();
          this.initializeTippy();
          this._setupPwaInstaller();
        },
        () => {
          console.error("Initial setup for app-button failed!");
        },
      );
    } catch (error) {
      console.error("Failed to initialize button component:", error);
    }
  }

  connectedCallback() {
    if (this.tippy && this.shadowRoot) {
      this.initializeTippy();
    }

    // Add event listeners
    this.addEventListener("click", this._handleClick.bind(this));
    this.addEventListener("keydown", this._handleKeyDown.bind(this));
  }

  disconnectedCallback() {
    this.destroyTippy();

    // Remove event listeners
    this.removeEventListener("click", this._handleClick.bind(this));
    this.removeEventListener("keydown", this._handleKeyDown.bind(this));

    // Remove PWA event listener if applicable
    if (this.props.type === "pwa-installer") {
      window.removeEventListener("beforeinstallprompt", this._handleBeforeInstallPrompt.bind(this));
    }
  }

  static get observedAttributes() {
    return [
      // Button attributes
      "id",
      "appearance",
      "size",
      "shape",
      "style",
      "loading",
      "disabled",
      "label",
      "icon-left",
      "icon-right",
      "icon-element-left",
      "icon-element-right",
      "icon-only",
      "type",
      "href",
      "download",
      "rel",
      "href-target",
      "title",
      // Form attributes
      "name",
      "value",
      "form",
      "formaction",
      "formmethod",
      "formtarget",
      "formnovalidate",
      "formenctype",
      // PWA attributes
      "install-text",
      // Tooltip attributes
      "tooltip",
      "tooltip-appearance",
      "tooltip-size",
      "tooltip-shape",
      "tooltip-position",
      "tooltip-html",
      "tooltip-animation",
      "tooltip-delay",
      "tooltip-duration",
      "tooltip-trigger",
      "tooltip-interactive",
      "tooltip-max-width",
      "tooltip-offset",
      "tooltip-arrow",
      "tooltip-class",
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || newValue === null) return;

    this.props[name] = newValue;

    // Special handling for boolean attributes
    if (name === "disabled" || name === "loading" || name === "formnovalidate" || name === "icon-only") {
      this.props[name] = this.hasAttribute(name);
    }

    // Auto-set type to link if href is present and type not explicitly set
    if (name === "href" && newValue && !this.hasAttribute("type")) {
      this.props.type = "link";
    }

    // Update icon-only state when icons or label changes
    if (name === "icon-left" || name === "icon-right" || name === "icon-element-left" || name === "icon-element-right" || name === "label") {
      this._updateIconOnlyState();
    }

    this.render();

    // Update tippy if the changed attribute affects tooltip
    if (name === "appearance" || name === "size" || name === "shape" || name.startsWith("tooltip-")) {
      this.updateTippy();
    }

    // Handle PWA installer type change
    if (name === "type") {
      const oldType = oldValue || "";
      const newType = newValue || "";

      if (oldType === "pwa-installer") {
        window.removeEventListener("beforeinstallprompt", this._handleBeforeInstallPrompt.bind(this));
      }

      if (newType === "pwa-installer") {
        this._setupPwaInstaller();
      }
    }
  }

  /**
   * Update the icon-only state based on current attributes
   * @private
   */
  _updateIconOnlyState() {
    const hasExplicitIconOnly = this.hasAttribute("icon-only");
    const hasLabel = this.props.label && this.props.label.trim() !== "";
    const hasIcons = this.props["icon-left"] || this.props["icon-right"] || this.props["icon-element-left"] || this.props["icon-element-right"];

    const shouldBeIconOnly = hasExplicitIconOnly || (hasIcons && !hasLabel);

    if (shouldBeIconOnly !== this.props["icon-only"]) {
      this.props["icon-only"] = shouldBeIconOnly;
    }
  }

  validateTooltipProps() {
    const {
      appearance,
      size,
      shape,
      "tooltip-appearance": tooltipAppearance,
      "tooltip-size": tooltipSize,
      "tooltip-shape": tooltipShape,
      "tooltip-position": position,
      "tooltip-animation": animation,
      "tooltip-trigger": trigger,
    } = this.props;

    return {
      appearance: BUTTON_CONFIG.APPEARANCES.includes(tooltipAppearance) ? tooltipAppearance : appearance || "primary",
      size: BUTTON_CONFIG.SIZES.includes(tooltipSize) ? tooltipSize : size || "m",
      shape: BUTTON_CONFIG.SHAPES.includes(tooltipShape) ? tooltipShape : shape || "curved",
      position: BUTTON_CONFIG.POSITIONS.includes(position) ? position : "top",
      animation: BUTTON_CONFIG.ANIMATIONS.includes(animation) ? animation : "fade",
      trigger: BUTTON_CONFIG.TRIGGERS.includes(trigger) ? trigger : "click",
    };
  }

  getTippyConfig() {
    const validatedProps = this.validateTooltipProps();
    const tooltipClasses = [`tippy-${validatedProps.appearance}`, `tippy-${validatedProps.size}`, `tippy-${validatedProps.shape}`];

    if (this.props["tooltip-class"]) {
      tooltipClasses.push(this.props["tooltip-class"]);
    }

    return {
      content: this.props["tooltip-html"] || this.props.tooltip,
      allowHTML: true,
      placement: validatedProps.position || "auto",
      theme: validatedProps.appearance,
      trigger: validatedProps["tooltip-trigger"] || "click",
      duration: null,
      interactive: true,
      arrow: true,
      appendTo: () => this.shadowRoot,
      interactiveDebounce: 75,
      hideOnClick: validatedProps.trigger === "click",
      onCreate: (instance) => {
        instance.popper.classList.add(...tooltipClasses);
      },
      onShow: (instance) => {
        // Hide all other tooltips except the current one
        if (this.tippy) {
          this.tippy.hideAll({ exclude: instance });
        }
      },
    };
  }

  parseOffset(offset) {
    if (typeof offset === "string") {
      try {
        return JSON.parse(offset);
      } catch {
        return [0, 10];
      }
    }
    return offset || [0, 10];
  }

  destroyTippy() {
    if (this.tippyInstance) {
      this.tippyInstance.destroy();
      this.tippyInstance = null;
    }
  }

  initializeTippy() {
    // Don't initialize if tooltip property is empty or tippy.js is unavailable
    if (!this.props.tooltip || !this.tippy) {
      return;
    }

    // Destroy previous instance if exists
    this.destroyTippy();

    // Create button container element to pass to tippy
    const button = this.shadowRoot.querySelector("button");
    if (!button) return;

    try {
      // Configure the tooltip
      const config = this.getTippyConfig();
      this.tippyInstance = this.tippy(button, config);
    } catch (error) {
      console.error("Failed to initialize tooltip", error);
    }
  }

  updateTippy() {
    if (!this.tippyInstance) {
      this.initializeTippy();
      return;
    }

    try {
      const config = this.getTippyConfig();
      this.tippyInstance.setProps({
        content: config.content,
        placement: config.placement,
      });
    } catch (error) {
      console.error("Failed to update tooltip", error);
    }
  }

  /**
   * Find the closest form element
   * @private
   * @returns {HTMLFormElement|null} The closest form element or null if not found
   */
  _findForm() {
    const { form } = this.props;

    if (form) {
      // If the form attribute is set, find the form by ID
      return document.getElementById(form);
    } else {
      // Find the closest form ancestor
      let parent = this.parentNode;
      while (parent) {
        if (parent.tagName === "FORM") {
          return parent;
        }
        parent = parent.parentNode;
      }
    }

    return null;
  }

  /**
   * Handle keydown events for accessibility
   * @private
   * @param {KeyboardEvent} event - Keydown event
   */
  _handleKeyDown(event) {
    const { disabled, loading } = this.props;

    // Prevent action if disabled or loading
    if (disabled || loading) {
      return;
    }

    // Trigger click on Enter or Space
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this._handleClick(event);
    }
  }

  /**
   * Handle click events
   * @private
   * @param {Event} event - Click event
   */
  _handleClick(event) {
    const { disabled, loading, type } = this.props;

    // Prevent action if disabled or loading
    if (disabled || loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Handle different button types
    if (type === "link") {
      this._handleLinkClick(event);
    } else if (type === "submit") {
      this._handleSubmit(event);
    } else if (type === "reset") {
      this._handleReset(event);
    } else if (type === "pwa-installer") {
      this._handlePwaInstall(event);
    }

    // Emit custom event
    this.dispatchEvent(
      new CustomEvent("button-click", {
        bubbles: true,
        composed: true,
        detail: { originalEvent: event },
      }),
    );
  }

  /**
   * Handle submit button click
   * @private
   * @param {Event} event - Click event
   */
  _handleSubmit(event) {
    const form = this._findForm();

    if (form) {
      event.preventDefault();

      // Apply form attributes if specified
      const { formaction, formmethod, formtarget, formnovalidate, formenctype } = this.props;

      const originalAction = form.getAttribute("action");
      const originalMethod = form.getAttribute("method");
      const originalTarget = form.getAttribute("target");
      const originalNoValidate = form.hasAttribute("novalidate");
      const originalEnctype = form.getAttribute("enctype");

      // Temporarily apply form attributes if specified
      if (formaction) form.setAttribute("action", formaction);
      if (formmethod) form.setAttribute("method", formmethod);
      if (formtarget) form.setAttribute("target", formtarget);
      if (formnovalidate) form.setAttribute("novalidate", "");
      if (formenctype) form.setAttribute("enctype", formenctype);

      // Submit the form
      form.submit();

      // Restore original attributes
      if (formaction) {
        if (originalAction) form.setAttribute("action", originalAction);
        else form.removeAttribute("action");
      }

      if (formmethod) {
        if (originalMethod) form.setAttribute("method", originalMethod);
        else form.removeAttribute("method");
      }

      if (formtarget) {
        if (originalTarget) form.setAttribute("target", originalTarget);
        else form.removeAttribute("target");
      }

      if (formnovalidate) {
        if (originalNoValidate) form.setAttribute("novalidate", "");
        else form.removeAttribute("novalidate");
      }

      if (formenctype) {
        if (originalEnctype) form.setAttribute("enctype", originalEnctype);
        else form.removeAttribute("enctype");
      }
    }
  }

  /**
   * Handle reset button click
   * @private
   * @param {Event} event - Click event
   */
  _handleReset(event) {
    const form = this._findForm();

    if (form) {
      event.preventDefault();
      form.reset();
    }
  }

  /**
   * Check if a URL is external to the current domain
   * @private
   * @param {string} url - The URL to check
   * @returns {boolean} True if the URL points to an external domain
   */
  _isExternalLink(url) {
    if (!url) return false;

    try {
      // Handle relative URLs and anchor links
      if (url.startsWith("/") || url.startsWith("#") || url.startsWith("./") || url.startsWith("../")) {
        return false;
      }

      // Handle mailto:, tel:, etc.
      if (url.includes(":") && !url.startsWith("http")) {
        return false;
      }

      // Compare with current domain
      const currentDomain = window.location.hostname;
      const urlObj = new URL(url, window.location.origin);
      return urlObj.hostname !== currentDomain;
    } catch (e) {
      // If URL parsing fails, assume it's not external
      return false;
    }
  }

  /**
   * Handle link button click
   * @private
   * @param {Event} event - Click event
   */
  _handleLinkClick(event) {
    const { href, "href-target": hrefTarget, download, rel } = this.props;
    const finalTarget = hrefTarget || "_blank";

    if (!href) return;

    event.preventDefault();

    // Handle download links
    if (download !== undefined && download !== null) {
      const a = document.createElement("a");
      a.href = href;
      a.download = download || "";
      a.rel = rel || "noopener noreferrer";
      a.target = finalTarget;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Handle regular links
    const isMailto = href.startsWith("mailto:");
    const isTel = href.startsWith("tel:");

    if (isMailto || isTel) {
      // For mailto: and tel: links, just navigate directly
      window.location.href = href;
    } else {
      // For regular links, use window.open with security features
      const newWindow = window.open(href, finalTarget, "noopener,noreferrer");
      if (newWindow) {
        newWindow.opener = null;
      }

      // Emit a navigation event
      this.dispatchEvent(
        new CustomEvent("button-navigate", {
          bubbles: true,
          composed: true,
          detail: {
            href,
            target: finalTarget,
            external: this._isExternalLink(href),
          },
        }),
      );
    }
  }

  /**
   * Setup PWA installer functionality
   * @private
   */
  _setupPwaInstaller() {
    if (this.props.type === "pwa-installer") {
      window.addEventListener("beforeinstallprompt", this._handleBeforeInstallPrompt.bind(this));

      // Check if it's available on iOS
      if (this.platform === "ios" && this._isPWAEnabled()) {
        const button = this.shadowRoot.querySelector("button");
        if (button) {
          button.classList.add("pwa-available");
        }
      }
    }
  }

  /**
   * Handle before install prompt event for PWA
   * @private
   * @param {Event} event - Before install prompt event
   */
  _handleBeforeInstallPrompt(event) {
    event.preventDefault();
    this.deferredPrompt = event;

    const button = this.shadowRoot.querySelector("button");
    if (button) {
      button.classList.add("pwa-available");
    }

    this.render();
  }

  /**
   * Handle PWA install button click
   * @private
   * @param {Event} event - Click event
   */
  _handlePwaInstall(event) {
    const { platform } = this;

    // For iOS, we can only show instructions
    if (platform === "ios") {
      // Create or show an instruction modal/tooltip
      const iosInstructions = "To install this web app on your iPhone:\n" + "1. Tap the Share button\n" + "2. Scroll down and tap 'Add to Home Screen'\n" + "3. Tap 'Add' in the upper right corner";

      alert(iosInstructions); // Use a better UI than alert in production
      return;
    }

    // For Android/desktop with deferredPrompt
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();

      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
          // Emit a custom event for successful installation
          this.dispatchEvent(
            new CustomEvent("app-installed", {
              bubbles: true,
              composed: true,
              detail: { platform },
            }),
          );
        } else {
          console.log("User dismissed the A2HS prompt");
          // Emit a custom event for installation dismissal
          this.dispatchEvent(
            new CustomEvent("app-install-dismissed", {
              bubbles: true,
              composed: true,
              detail: { platform },
            }),
          );
        }
        this.deferredPrompt = null;

        const button = this.shadowRoot.querySelector("button");
        if (button) {
          button.classList.remove("pwa-available");
        }
      });
    } else if (platform === "desktop" && navigator.getInstalledRelatedApps) {
      // For newer browsers that support the getInstalledRelatedApps API
      navigator.getInstalledRelatedApps().then((relatedApps) => {
        if (relatedApps.length === 0) {
          // Try to trigger installation manually
          const installButton = document.createElement("button");
          installButton.style.display = "none";
          installButton.onclick = () => {
            if (window.BeforeInstallPromptEvent) {
              const event = new BeforeInstallPromptEvent("beforeinstallprompt");
              window.dispatchEvent(event);
            }
          };
          document.body.appendChild(installButton);
          installButton.click();
          document.body.removeChild(installButton);
        } else {
          alert("App is already installed");
        }
      });
    }
  }

  /**
   * Detect the current platform (iOS, Android, or desktop)
   * @private
   * @returns {string} The detected platform: 'ios', 'android', or 'desktop'
   */
  _detectPlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // iOS detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "ios";
    }

    // Android detection
    if (/android/i.test(userAgent)) {
      return "android";
    }

    // Default to desktop
    return "desktop";
  }

  /**
   * Check if PWA is enabled by looking for the manifest and service worker
   * @private
   * @returns {boolean} True if the basic PWA requirements are met
   */
  _isPWAEnabled() {
    const hasManifest = !!document.querySelector('link[rel="manifest"]');
    return hasManifest && "serviceWorker" in navigator;
  }

  /**
   * Render an icon element
   * @private
   * @param {string} position - The position of the icon ("left" or "right")
   * @param {string|null} iconClasses - CSS classes for font icon
   * @param {string|null} customElementTag - Custom element tag name
   * @param {HTMLElement} iconContainer - The container element for the icon
   */
  _renderIcon(position, iconClasses, customElementTag, iconContainer) {
    if (!iconContainer) return;

    // Clear previous content
    while (iconContainer.firstChild) {
      iconContainer.removeChild(iconContainer.firstChild);
    }

    iconContainer.className = "";

    // Handle no icon case
    if (!iconClasses && !customElementTag) {
      iconContainer.style.display = "none";
      return;
    }

    // Set display to flex for proper alignment
    iconContainer.style.display = "flex";

    // Handle custom element
    if (customElementTag) {
      try {
        const customElement = document.createElement(customElementTag);
        iconContainer.appendChild(customElement);
      } catch (error) {
        console.error(`Failed to create custom icon element: ${customElementTag}`, error);
      }
      return;
    }

    // Handle font icon classes
    if (iconClasses) {
      // Add each class separately
      iconClasses.split(" ").forEach((className) => {
        if (className) iconContainer.classList.add(className);
      });
    }
  }

  render() {
    if (!this.shadowRoot) return;

    const {
      id,
      appearance,
      size,
      shape,
      style,
      disabled,
      loading,
      label,
      title,
      "icon-left": iconLeft,
      "icon-right": iconRight,
      "icon-element-left": iconElementLeft,
      "icon-element-right": iconElementRight,
      "icon-only": iconOnly,
      type,
      href,
      "href-target": hrefTarget,
      download,
      rel,
      name,
      value,
      form,
      formaction,
      formmethod,
      formtarget,
      formnovalidate,
      formenctype,
      "install-text": installText,
    } = this.props;

    const buttonElement = document.createElement("button");
    buttonElement.id = id || "";
    buttonElement.setAttribute("role", type === "link" ? "link" : "button");
    buttonElement.style.cssText = style || "";

    // Set data attributes for styling
    buttonElement.dataset.appearance = appearance || "primary";
    buttonElement.dataset.size = size || "m";
    buttonElement.dataset.shape = shape || "curved";
    buttonElement.dataset.type = type || "button";
    buttonElement.dataset.iconOnly = iconOnly ? "true" : "false";

    // Set attributes
    if (disabled) buttonElement.setAttribute("disabled", "");
    if (title) buttonElement.setAttribute("title", title);

    // Add classes for states
    if (this.platform) {
      buttonElement.classList.add(`platform-${this.platform}`);
    }

    // Make the PWA installer button visible if install prompt is available
    if (type === "pwa-installer" && this.deferredPrompt) {
      buttonElement.classList.add("pwa-available");
    }

    // Create icon elements
    const iconLeftElement = document.createElement("i");
    iconLeftElement.id = "button-icon-left";
    iconLeftElement.setAttribute("aria-hidden", "true");

    const iconRightElement = document.createElement("i");
    iconRightElement.id = "button-icon-right";
    iconRightElement.setAttribute("aria-hidden", "true");

    // Create label element
    const labelElement = document.createElement("div");
    labelElement.id = "button-label";

    // Set label text and display
    labelElement.textContent = label || "";
    if (iconOnly) {
      labelElement.style.display = "none";
    }

    // For PWA installer type, set platform-specific text if none provided
    if (type === "pwa-installer" && !installText) {
      if (this.platform === "ios") {
        labelElement.textContent = "Add to Home Screen";

        // Create platform-specific spans
        const iosSpan = document.createElement("span");
        iosSpan.classList.add("platform-ios");
        iosSpan.textContent = "Add to Home Screen";

        const androidSpan = document.createElement("span");
        androidSpan.classList.add("platform-android");
        androidSpan.textContent = "Install App";

        const desktopSpan = document.createElement("span");
        desktopSpan.classList.add("platform-desktop");
        desktopSpan.textContent = "Install";

        // Clear the label and append spans
        labelElement.textContent = "";
        labelElement.appendChild(iosSpan);
        labelElement.appendChild(androidSpan);
        labelElement.appendChild(desktopSpan);
      } else if (this.platform === "android") {
        labelElement.textContent = "Install App";
      } else {
        labelElement.textContent = "Install";
      }
    }

    // Add button elements
    buttonElement.appendChild(iconLeftElement);
    buttonElement.appendChild(labelElement);
    buttonElement.appendChild(iconRightElement);

    // Create loader if loading
    if (loading) {
      const loaderContainer = document.createElement("div");
      loaderContainer.id = "loader-container";
      loaderContainer.dataset.size = size || "m";
      loaderContainer.style.position = "absolute";
      loaderContainer.style.top = "50%";
      loaderContainer.style.left = "50%";
      loaderContainer.style.transform = "translate(-50%, -50%)";

      const loader = document.createElement("div");
      loader.id = "loader";
      loader.dataset.appearance = appearance || "primary";
      loaderContainer.appendChild(loader);

      buttonElement.appendChild(loaderContainer);
      iconLeftElement.style.visibility = "hidden";
      iconRightElement.style.visibility = "hidden";
      labelElement.style.visibility = "hidden";
    }

    // Handle link button type
    if (type === "link" && href) {
      buttonElement.dataset.href = href;
      buttonElement.dataset.target = hrefTarget || "_blank";

      if (download !== undefined && download !== null) {
        buttonElement.dataset.download = download || "";
      }

      buttonElement.dataset.rel = rel || "noopener noreferrer";

      // Set aria-label for better accessibility
      const isExternalLink = this._isExternalLink(href);
      if (isExternalLink && !buttonElement.hasAttribute("aria-label")) {
        buttonElement.setAttribute("aria-label", `${label || ""} (opens in a new window)`);
      }
    }

    // Handle form button types
    if (type === "submit" || type === "reset") {
      if (name) buttonElement.dataset.name = name;
      if (value) buttonElement.dataset.value = value;
      if (form) buttonElement.dataset.form = form;
      if (formaction) buttonElement.dataset.formaction = formaction;
      if (formmethod) buttonElement.dataset.formmethod = formmethod;
      if (formtarget) buttonElement.dataset.formtarget = formtarget;
      if (formnovalidate) buttonElement.dataset.formnovalidate = "true";
      if (formenctype) buttonElement.dataset.formenctype = formenctype;
    }

    // Process icons
    this._renderIcon("left", iconLeft, iconElementLeft, iconLeftElement);
    this._renderIcon("right", iconRight, iconElementRight, iconRightElement);

    // Clear previous content and append new button
    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild);
    }
    this.shadowRoot.appendChild(buttonElement);
  }
}

// Register component
try {
  customElements.define("app-button", AppButtonComponent);
  console.log("Button component registered successfully");
} catch (error) {
  console.warn("Button component registration issue:", error.message);
}

// Export component
export default AppButtonComponent;
