class BlogComponent extends HTMLElement {
  constructor(
    templateUrl = "portfolio/components/sections/blog-preview/blog-preview.html",
    templateStyleUrls = [
      "portfolio/main.css",
      "portfolio/components/sections/blog-preview/blog-preview.css",
      "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css",
    ],
  ) {
    super();

    this.templateUrl = templateUrl;
    this.templateStyleUrls = templateStyleUrls;

    setComponentTemplate.call(
      this,
      () => {
        this.fetchBlogPostsData();
      },
      () => {
        console.log("Initial setup failed!");
      },
    );
  }

  static get observedAttributes() {
    return [
      /* Attributes to observe. */
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, oldValue, newValue) {}

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  // async fetchBlogPostsData() {
  //   const xmlFetch = await fetch("https://baijudodhia.blogspot.com/feeds/posts/default", { mode: "no-cors" });
  //   const xmlText = await xmlFetch.text();
  //   const xml = await new window.DOMParser().parseFromString(xmlText, "text/xml");
  //   let x = xml.documentElement.childNodes;
  //   this.loadBlogPosts(x);
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

customElements.define("app-blog-posts", BlogComponent);
