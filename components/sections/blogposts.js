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
            border: 1.5px solid;
            border-image: var(--gradient-primary) 30;
            background-image: none;
            background-clip: content-box, border-box;
            background-origin: border-box;
            box-shadow: 0px 0px 10px -4px var(--color-secondary);
            transition: 0.05s linear;
        }
        .blog-item:hover {
            font-weight: var(--font-weight-hover);
            color: var(--color-bw_secondary);
            background-image: var(--gradient-primary);
            background-clip: border-box;
            background-origin: border-box;
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
	async fetchBlogPostsData() {
		const xmlFetch = await fetch("https://baijudodhia.github.io/blog/recent3posts.xml");
		const xmlText = await xmlFetch.text();
		const xml = await new window.DOMParser().parseFromString(xmlText, "text/xml");
		let x = xml.documentElement.childNodes;
		this.loadBlogPosts(x);
	}

	loadBlogPosts(data) {
		let blogsContainer = document.createElement("div");
		blogsContainer.setAttribute("id", "blogs-container");
		blogsContainer.innerHTML = "";
		let blogsTemplate = this.shadowRoot.querySelector("#blogs-template");
		for (let i = 0; i < data.length; i++) {
			if (data[i].nodeType == 1) {
				var clone = blogsTemplate.content.cloneNode(true);
				clone.querySelector(".blog-title").innerText = data[i].getElementsByTagName("title")[0].firstChild.nodeValue;
				clone.querySelector(".blog-url").setAttribute("link", data[i].getElementsByTagName("loc")[0].firstChild.nodeValue + "?utm_source=baijudodhia.github.io&utm_medium=blog_section_view_all_btn");
				clone.querySelector(".blog-excerpt").innerText = data[i].getElementsByTagName("excerpt")[0].firstChild.nodeValue;
				// const tags =
				//   x[i].getElementsByTagName("tags")[0].firstChild.nodeValue;
				// const category =
				//   x[i].getElementsByTagName("category")[0].firstChild.nodeValue;
				blogsContainer.append(clone);
			}
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
