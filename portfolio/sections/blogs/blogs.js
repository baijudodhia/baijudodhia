class BlogComponent extends HTMLElement {
  constructor(
    props = {
      id: "blog",
    },
    basePath = "/portfolio/sections/blogs",

    templateHtml = `
      <div id="blogs">
        <div class="blogs-header">
          <h3>Blogs</h3>
          <app-button
            id="app-view-all"
            appearance="secondary"
            label="view all"
            type="link"
            size="m"
            href="https://baijudodhia.github.io/blog?utm_source=baijudodhia.github.io&utm_medium=blog_section_view_all_btn"
            icon-right="fas fa-external-link-square-alt"
          ></app-button>
        </div>
        <div id="blogs-container"> </div>
      </div>

      <template id="blog-body-template">
        <div
          class="blog-body"
          style="display: flex; flex-direction: column; gap: 1rem; height: 100%"
        >
          <img
            class="blog-thumbnail"
            style="
        object-fit: contain;
        width: 100%;
        height: 8rem;
        min-width: unset;
        max-width: unset;
        max-height: unset;
        min-height: unset;
        display: flex;
        align-self: stretch;
        justify-content: center;
        align-content: center;
        flex-direction: row;
        background-color: #ffffff;
        border-radius: 0.5rem;
        border-width: 1px;
        border-style: solid;
        border-color: var(--color-primary);
        box-shadow: 0px 2px 10px -3px var(--color-primary);
      "
          />
          <div
            class="blog-title"
            style="flex-grow: 1; display: flex; flex-direction: column; column-gap: 1rem"
          ></div>
          <div
            class="blog-tags"
            style="
        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        column-gap: 0.5rem;
      "
          ></div>
        </div>
      </template>

      <template id="blog-links-template">
        <div
          class="blog-links"
          style="
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      align-content: center;
      column-gap: 1rem;
    "
        >
          <app-button
            id="blog-link"
            appearance="secondary"
            label="read"
            type="link"
            size="s"
            href=""
            icon-right="fas fa-arrow-right"
          ></app-button>
        </div>
      </template>

      <template id="blog-tag-template">
        <app-button
          id="blog-tag"
          appearance="secondary"
          label=""
          type="link"
          size="xs"
          href=""
        ></app-button>
      </template>
    `,
    templateStyleUrls = [
      `
      #blogs {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  align-content: center;
  row-gap: 1.5rem;
}

.blogs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-content: center;
  flex-direction: row;
  column-gap: 1rem;
}

#blogs-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-row-gap: 1.5rem;
  grid-column-gap: 1.5rem;
}
@media only screen and (max-width: 950px) {
  #blogs-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-row-gap: 1rem;
    grid-column-gap: 1rem;
  }
}
@media only screen and (max-width: 650px) {
  #blogs-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

      `,
      "/portfolio/main.css",
      "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css",
    ],
  ) {
    super();

    this.props = props;
    this.basePath = basePath;
    this.templateHtml = templateHtml;
    this.templateStyleUrls = templateStyleUrls;

    setComponentTemplate.call(
      this,
      () => {
        // Below code is commented since blogs are fetched from main index.js file through script.
        // this.fetchData();
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

  static get observedAttributes() {
    return ["blogs"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "blogs" && oldValue !== newValue && newValue) {
      this.loadComponent(JSON.parse(newValue));
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  async fetchData() {
    this.addSectionLoader();

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

    this.loadComponent(recentPosts);
  }

  loadComponent(data) {
    if ("content" in document.createElement("template")) {
      this.addSectionLoader();

      const resetContainer = () => {
        const existingContainer = this.shadowRoot.querySelector("#blogs-container");
        if (existingContainer) {
          existingContainer.remove();
        }

        let container = document.createElement("div");
        container.setAttribute("id", "blogs-container");
        container.innerHTML = "";

        return container;
      };

      const setupItemTemplate = (data, parentNode) => {
        const card = document.createElement("app-card");

        data.map((item, idx) => {
          const getCardBody = (item) => {
            const clone = this.shadowRoot.querySelector("#blog-body-template").content.cloneNode(true);

            if (item?.thumbnail) {
              clone.querySelector(".blog-thumbnail").setAttribute("src", item.thumbnail.replace("/s72-c/", "/h680/"));
            } else {
              clone.querySelector(".blog-thumbnail").remove();
            }

            if (item?.title) {
              clone.querySelector(".blog-title").innerText = item.title;
            } else {
              clone.querySelector(".blog-title").remove();
            }

            if (item?.tags) {
              const getBlogTagsTemplate = (container, tags) => {
                const template = this.shadowRoot.querySelector("#blog-tag-template");

                for (let i = 0; i < tags.length; i++) {
                  const tag = tags[i];

                  const clone = template.content.cloneNode(true);
                  clone
                    .querySelector("#blog-tag")
                    .setAttribute("href", `https://baijudodhia.blogspot.com/search/label/${tag}`);
                  clone.querySelector("#blog-tag").setAttribute("label", tag);

                  container.append(clone);
                }
              };

              getBlogTagsTemplate(clone.querySelector(".blog-tags"), item.tags);
            }

            return new XMLSerializer().serializeToString(clone);
          };

          const getCardFooter = (item) => {
            const clone = this.shadowRoot.querySelector("#blog-links-template").content.cloneNode(true);

            if (item?.url) {
              clone
                .querySelector("#blog-link")
                .setAttribute("href", item.url + "?utm_source=baijudodhia.github.io&utm_medium=read_blog_btn");
            } else {
              clone.querySelector(".blog-url").remove();
            }

            return new XMLSerializer().serializeToString(clone);
          };

          const clone = card.cloneNode(true);

          clone.setAttribute("id", `blog-${idx}`);
          clone.setAttribute("body", getCardBody(item));
          clone.setAttribute("footer", getCardFooter(item));

          parentNode.append(clone);
        });

        this.shadowRoot.querySelector("#blogs").append(parentNode);
      };

      const blogsBody = resetContainer();
      setupItemTemplate(data, blogsBody);

      this.removeSectionLoader();
    }

    //     const getBlogTagsTemplate = (container, tags) => {
    //       let blogTagTemplate = this.shadowRoot.querySelector("#blog-tag-template");
    //
    //       for (let i = 0; i < tags.length; i++) {
    //         let tag = tags[i];
    //
    //         var blogTagTemplateClone = blogTagTemplate.content.cloneNode(true);
    //         blogTagTemplateClone
    //           .querySelector(".blog-tag")
    //           .setAttribute("href", `https://baijudodhia.blogspot.com/search/label/${tag}`);
    //         blogTagTemplateClone.querySelector(".blog-tag").innerText = tag;
    //
    //         container.append(blogTagTemplateClone);
    //       }
    //     };

    // let blogsTemplate = this.shadowRoot.querySelector("#blogs-template");
    // for (let i = 0; i < recentPosts.length; i++) {
    //   let post = recentPosts[i];
    //   var clone = blogsTemplate.content.cloneNode(true);
    // clone.querySelector(".blog-title").innerText = post.title;
    // clone
    //   .querySelector(".blog-url")
    //   .setAttribute("link", post.url + "?utm_source=baijudodhia.github.io&utm_medium=read_blog_btn");
    // clone.querySelector(".blog-thumbnail").setAttribute("src", post.thumbnail.replace("/s72-c/", "/h680/"));

    // getBlogTagsTemplate(clone.querySelector(".blog-tags"), post.tags);

    //   blogsContainer.append(clone);
    // }
    // this.removeSectionLoader();
    // this.shadowRoot.querySelector("#blogs").append(blogsContainer);
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
