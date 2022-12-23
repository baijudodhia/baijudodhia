const BlogPostsTemplate = document.createElement("template");
BlogPostsTemplate.innerHTML = `
    <link href='../../main.css' rel='stylesheet'>
    <style>
        #blogs {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;
            align-content: center;
            row-gap: 30px;
        }
        .blogs-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            align-content: center;
            flex-direction: row;
            column-gap: 20px;
        }
        #blogs-container {
            display: flex;
            flex-direction: column;
            row-gap: 20px;
        }
        .blog-item {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;
            align-content: space-between;
            row-gap: 15px;
            padding: 20px;
            transition: 0.05s linear;
            border: 1.5px solid var(--color-primary);
            // border-image: var(--gradient-primary) 30;
            // background-image: none;
            // background-clip: content-box, border-box;
            // background-origin: border-box;
            border-radius: 1rem;
            box-shadow: 0px 0px 10px -4px var(--color-secondary);
        }
        .blog-item:hover {
            font-weight: var(--font-weight-hover);
            color: var(--color-bw_secondary);
            border: 1.5px solid var(--color-primary);
            // border-image: var(--gradient-primary) 30;
            // background-image: var(--gradient-primary);
            background-color: var(--color-primary);
            // background-clip: border-box;
            // background-origin: border-box;
            box-shadow: 0px 0px 10px -4px var(--color-secondary);
        }
        .blog-item:hover .blog-divider {
            border-top: 1.5px dashed var(--color-bw_secondary);
        }
        .blog-item:hover app-link::part(link) {
            font-weight: var(--font-weight-hover);
            color: var(--color-bw_primary);
        }
        .blog-item:hover app-link::part(link_container) {
            border-radius: 5px;
        }
        .blog-item:hover app-link::part(link_container):hover {
            border-radius: 5px;
            background-color: var(--color-bw_secondary);
            box-shadow: 0px 0px 10px -4px var(--color-secondary);
        }
        .blog-item:hover app-link::part(link) {
            font-weight: var(--font-weight-hover);
            color: var(--color-bw_secondary_invert);
        }
        .blog-divider {
            align-self: stretch;
            margin: 0px;
            border: none;
            border-top: 1.5px dashed var(--color-bw_secondary_invert);
            height: 0px;
            background-color: transparent;
        }
        .blog-excerpt {
            flex-grow: 1;
            font-size: 16px;
        }
        @media only screen and (max-width: 340px) {
            .blog-excerpt {
              font-size: 14px;
            }
          }
        .blog-links {
            flex-grow: 1;
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
            align-content: center;
            column-gap: 20px;
        }
    </style>
    <div id="blogs">
        <div class="blogs-header">
            <h3>Recent Blog Posts</h3>
            <app-link
                title="view all"
                link="https://baijudodhia.github.io/blog?utm_source=baijudodhia.github.io&utm_medium=blog_section_view_all_btn"
            ></app-link>
        </div>
    </div>
    <template id="blogs-template">
        <div class="blog-item">
            <div class="blog-title"></div>
            <div class="blog-divider"></div>
            <div class="blog-excerpt"></div>
            <app-link
                class="blog-url"
                icon="fas fa-arrow-right"
                icon-direction="right"
                icon-title="Read the full Blog"
                title="Read"
                link=""
            ></app-link>
        </div>
    </template>
`;

class AppBlogPosts extends HTMLElement {
    constructor() {
        super();
        // element created
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(BlogPostsTemplate.content.cloneNode(true));

        this.addSectionLoader();
        this.fetchBlogPostsData();
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
        const feedUrl = "https://baijudodhia.blogspot.com/feeds/posts/default";
        const response = await fetch(feedUrl);
        const xmlText = await response.text();
        const xml = await new window.DOMParser().parseFromString(xmlText, "text/xml");
        let entries = xml.getElementsByTagName("entry");

        // Get the URL, title, and summary for the 3 most recent posts
        let recentPosts = [];
        for (let i = 0; i < 3; i++) {
            let entry = entries[i];
            let title = entry.getElementsByTagName("title")[0] ? entry.getElementsByTagName("title")[0].textContent : "";
            let summary = entry.getElementsByTagName("summary")[0] ? entry.getElementsByTagName("summary")[0].textContent : "";
            let url = "";
            let linkElements = entry.getElementsByTagName("link");
            for (let j = 0; j < linkElements.length; j++) {
                let linkElement = linkElements[j];
                let rel = linkElement.getAttribute("rel");
                let type = linkElement.getAttribute("type");
                if (rel === "alternate" && type === "text/html") {
                    url = linkElement.getAttribute("href");
                    break;
                }
            }

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
            clone.querySelector(".blog-url").setAttribute("link", post.url + "?utm_source=baijudodhia.github.io&utm_medium=blog_section_view_all_btn");
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
