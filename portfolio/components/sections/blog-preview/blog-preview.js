const BlogPostsTemplate = document.createElement("template");
BlogPostsTemplate.innerHTML = `

`;

class AppBlogPosts extends HTMLElement {
  constructor() {
    super();
    // element created

    fetch("portfolio/components/sections/blog-preview/blog-preview.html")
      .then((response) => response.text())
      .then((html) => {
        // Inject the HTML into the shadow DOM
        AboutTemplate.innerHTML = html;

        // Continue with your existing code...
        // (e.g., add event listeners, set up callbacks)
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(AboutTemplate.content.cloneNode(true));

        const styles = [
          "portfolio/components/sections/blog-preview/blog-preview.css",
          "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css",
        ];

        // Call is a prototype for Functions in JS, which correctly binds the context of this
        setStyles.call(this, styles);

        this.fetchBlogPostsData();
      });
  }

  connectedCallback() {
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  static get observedAttributes() {
    return [
      /* Attributes to observe. */
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  // there can be other element methods and properties
  // async fetchBlogPostsData() {
  // 	const xmlFetch = await fetch("https://baijudodhia.blogspot.com/feeds/posts/default");
  // 	const xmlText = await xmlFetch.text();
  // 	const xml = await new window.DOMParser().parseFromString(xmlText, "text/xml");
  // 	let x = xml.documentElement.childNodes;
  // 	this.loadBlogPosts(x);
  // }
  async fetchBlogPostsData() {
    const feedUrl = "https://baijudodhia.blogspot.com/feeds/posts/default?alt=rss";
    const response = await fetch(feedUrl, { mode: "no-cors" });
    const xmlText = await response.text();
    const xml = await new window.DOMParser().parseFromString(xmlText, "text/xml");
    let entries = xml.getElementsByTagName("entry");

    // Get the URL, title, and summary for the 3 most recent posts
    let recentPosts = [];
    for (let i = 0; i < 3; i++) {
      let entry = entries[i];
      let link = entry.getElementsByTagName("link")[0];
      let url = link.getAttribute("href");
      let title = entry.getElementsByTagName("title")[0].textContent;
      let summary = entry.getElementsByTagName("summary")[0].textContent;

      // Get the tags for the post
      let tags = [];
      let tagElements = entry.getElementsByTagName("category");
      for (let j = 0; j < tagElements.length; j++) {
        let tagElement = tagElements[j];
        let tag = tagElement.textContent || tagElement.getAttribute("term");
        tags.push(tag);
      }

      recentPosts.push({ url, title, summary, tags });
    }

    this.loadBlogPosts(recentPosts);
  }

  loadBlogPosts(recentPosts) {
    let blogsContainer = document.createElement("div");
    blogsContainer.setAttribute("id", "blogs-container");
    blogsContainer.innerHTML = "";
    let blogsTemplate = this.shadowRoot.querySelector("#blogs-template");
    for (let i = 0; i < recentPosts.length; i++) {
      let post = recentPosts[i];
      var clone = blogsTemplate.content.cloneNode(true);
      clone.querySelector(".blog-title").innerText = post.title;
      clone
        .querySelector(".blog-url")
        .setAttribute("link", post.url + "?utm_source=baijudodhia.github.io&utm_medium=blog_section_view_all_btn");
      blogsContainer.append(clone);
    }
    this.removeSectionLoader();
    this.shadowRoot.querySelector("#blogs").append(blogsContainer);
  }

  addSectionLoader() {
    // Section Loader
    const sectionLoader = document.createElement("div");
    sectionLoader.setAttribute("class", "section-loader");

    const blogPosts = this.shadowRoot.querySelector("#blogs");
    blogPosts.append(sectionLoader);
  }

  removeSectionLoader() {
    this.shadowRoot.querySelector(".section-loader").remove();
  }
}

customElements.define("app-blog-posts", AppBlogPosts);
