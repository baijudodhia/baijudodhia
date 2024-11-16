/**
 * NOTE: Todo
 * Although the index.css is bundled now with component.min.js but still web-components can access the styles applied to tags, classes or ids, they can only access variables.
 * So now will have to update the base components to make them truely independent and only depend on css variables.
 */
import { getComponentProps, isEmptyValue, setComponentTemplate } from "../../../utils/index.js";
import socialLinksCssTemplate from "./social-links.css";
import socialLinksHtmlTemplate from "./social-links.html";

class AppSocialLinks extends HTMLElement {
  constructor(
    props = {
      id: "socialLinks",
      color: "",
    },
    basePath = "/components/core/social-links",
    templateHtml = socialLinksHtmlTemplate,
    templateStyleUrls = [socialLinksCssTemplate],
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
        console.log("Initial setup for app-social-links failed!");
      },
    );
  }

  connectedCallback() {
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
    this.showLinks();
  }

  static get observedAttributes() {
    return ["github", "linkedin", "blog", "portfolio"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
    this.showLinks();
  }

  showLinks() {
    const _social_links = this.shadowRoot.querySelector(".social-links");
    _social_links.innerHTML = "";

    const utmSource = window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1") ? "baijudodhia.github.io" : window.location.hostname;

    if (this.hasAttribute("github")) {
      const _app_link_github = this.createLink("fab fa-github", "Check out projects on GitHub", "GitHub", `https://github.com/baijudodhia/?utm_source=${utmSource}&utm_medium=website`);
      _social_links.append(_app_link_github);
    }

    if (this.hasAttribute("linkedin")) {
      const _app_link_linkedin = this.createLink("fab fa-linkedin", "Connect with me on LinkedIn", "LinkedIn", `https://www.linkedin.com/in/baijudodhia/?utm_source=${utmSource}&utm_medium=website`);
      _social_links.append(_app_link_linkedin);
    }

    if (this.hasAttribute("blog")) {
      const _app_link_blog = this.createLink("fas fa-rss", "Read my Blogs", "Blog", `https://baijudodhia.blogspot.com/?utm_source=${utmSource}&utm_medium=website`);
      _social_links.append(_app_link_blog);
    }

    if (this.hasAttribute("portfolio")) {
      const _app_link_portfolio = this.createLink("fas fa-laptop-code", "Baiju Dodhia | Portfolio", "Portfolio", `https://baijudodhia.github.io/?utm_source=${utmSource}&utm_medium=website`);
      _social_links.append(_app_link_portfolio);
    }
  }

  createLink(icon, iconTitle, title, link) {
    const _app_link = document.createElement("app-button");
    _app_link.setAttribute("icon-left", icon);
    _app_link.setAttribute("label", title);
    _app_link.setAttribute("title", iconTitle);
    _app_link.setAttribute("type", "link");
    _app_link.setAttribute("href", link);
    _app_link.setAttribute("size", "s");
    _app_link.setAttribute("appearance", "primary");
    return _app_link;
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  getElement() {
    if (!this.shadowRoot) {
      return null;
    }

    const element = this.shadowRoot.querySelector("#social-links");
    if (element) {
      element.remove();
    }

    let socialLinks = document.createElement("div");
    socialLinks.classList.add("social-links");
    socialLinks.setAttribute("id", "social-links");
    socialLinks.innerHTML = "";

    this.shadowRoot.appendChild(socialLinks);

    return socialLinks;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#social-links-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  // there can be other element methods and properties
  render() {
    this.props = getComponentProps.call(this, this.props);
    const socialLinks = this.getElement();

    if (socialLinks && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the socialLinks element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "color") {
            const color_changer = this.shadowRoot.getElementById("social-links-input");
            color_changer.value = window.HSLToHex(getComputedStyle(document.documentElement, null).getPropertyValue("--color-primary"));
          } else if (key === "id") {
            socialLinks.setAttribute(`${key}`, value);
          }
        }
      });

      // Render children
      socialLinks.innerHTML = ""; // Clear existing content
      socialLinks.appendChild(itemTemplate);
    }
  }
}

customElements.define("app-social-links", AppSocialLinks);
