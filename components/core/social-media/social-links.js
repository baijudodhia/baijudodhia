const SocialLinksTemplate = document.createElement("template");
SocialLinksTemplate.innerHTML = `
    <link href="./portfolio/main.css" rel="stylesheet">
    <style>
        .social-links {
            display: flex;
            flex-direction: row;
            align-content: center;
            align-items: center;
            column-gap: 10px;
        }
    </style>
    <div class="social-links"></div>
`;

class AppSocialLinks extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(SocialLinksTemplate.content.cloneNode(true));
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

    const utmSource =
      window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1")
        ? "baijudodhia.github.io"
        : window.location.hostname;

    if (this.hasAttribute("github")) {
      const _app_link_github = this.createLink(
        "fab fa-github",
        "Check out projects on GitHub",
        "GitHub",
        `https://github.com/baijudodhia/?utm_source=${utmSource}&utm_medium=website`,
      );
      _social_links.append(_app_link_github);
    }

    if (this.hasAttribute("linkedin")) {
      const _app_link_linkedin = this.createLink(
        "fab fa-linkedin",
        "Connect with me on LinkedIn",
        "LinkedIn",
        `https://www.linkedin.com/in/baijudodhia/?utm_source=${utmSource}&utm_medium=website`,
      );
      _social_links.append(_app_link_linkedin);
    }

    if (this.hasAttribute("blog")) {
      const _app_link_blog = this.createLink(
        "fas fa-rss",
        "Read my Blogs",
        "Blog",
        `https://baijudodhia.blogspot.com/?utm_source=${utmSource}&utm_medium=website`,
      );
      _social_links.append(_app_link_blog);
    }

    if (this.hasAttribute("portfolio")) {
      const _app_link_portfolio = this.createLink(
        "fas fa-laptop-code",
        "Baiju Dodhia | Portfolio",
        "Portfolio",
        `https://baijudodhia.github.io/?utm_source=${utmSource}&utm_medium=website`,
      );
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

  // there can be other element methods and properties
}

customElements.define("app-social-links", AppSocialLinks);
