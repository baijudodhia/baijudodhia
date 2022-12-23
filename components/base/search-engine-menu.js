const SearchEngineMenuTemplate = document.createElement("template");
SearchEngineMenuTemplate.innerHTML = `
    <link href="../../main.css" rel="stylesheet">
    <style>
        .search-engine-menu {
            display: flex;
            flex-direction: column;
            align-content: center;
            justify-content: center;
            align-items: flex-start;
        }
        .search-engine-menu-item {
            align-self: stretch;
            cursor: pointer;
            width: max-content;
        }
        .search-engine-menu-item.active {
            color: var(--color-primary);
        }
        .search-engine-menu-item:hover {
            color: var(--color-primary);
        }
        .search-engine-menu-triangle-up {
            align-self: flex-end;
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-bottom: 15px solid var(--color-bw_secondary);
            z-index: 1;
            transform: translateX(50%);
            margin-right: 50%;
        }
        .search-engine-menu-item-container {
            align-self: stretch;
            padding: 15px;
            background-color: var(--color-bw_secondary);
            color: var(--color-bw_secondary_invert);
            display: flex;
            flex-direction: column;
            align-content: center;
            justify-content: flex-start;
            align-items: flex-start;
            row-gap: 10px;
            max-height: calc(100vh - 150px);
            overflow-y: auto;
        }
    </style>
    <div class="search-engine-menu">
        <div class="search-engine-menu-triangle-up"></div>
        <div class="search-engine-menu-item-container">
            <div
                id="search-engine-google"
                class="search-engine-menu-item"
                value="google"
                title="Google Search | Baiju Dodhia"
                onclick="javascript:searchRedirect('about_name_search_engine_menu','google','&quot;Baiju&nbsp;Dodhia&quot;&nbsp;OR&nbsp;&quot;baijudodhia&quot;')"
            >
                Google Search
            </div>
            <hr class="dashed-divider" />
            <div
                id="search-engine-bing"
                class="search-engine-menu-item"
                value="bing"
                title="Microsoft Bing Search | Baiju Dodhia"
                onclick="javascript:searchRedirect('about_name_search_engine_menu','bing','Baiju&nbsp;Dodhia')"
            >
                Bing Search
            </div>
            <hr class="dashed-divider" />
            <div
                id="search-engine-duckduckgo"
                class="search-engine-menu-item"
                value="duckduckgo"
                title="DuckDuckGo Search | Baiju Dodhia"
                onclick="javascript:searchRedirect('about_name_search_engine_menu','duckduckgo','Baiju&nbsp;Dodhia')"
            >
                DuckDuckGo Search
            </div>
            <hr class="dashed-divider" />
            <div
                id="search-engine-brave"
                class="search-engine-menu-item"
                value="brave"
                title="Brave Search | Baiju Dodhia"
                onclick="javascript:searchRedirect('about_name_search_engine_menu','brave','Baiju&nbsp;Dodhia')"
            >
                Brave Search
            </div>
    </div>
`;

class AppSearchEngineMenu extends HTMLElement {
    constructor() {
        super();
        // element created

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(SearchEngineMenuTemplate.content.cloneNode(true));
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
            /* Value to watch for */
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
}

customElements.define("app-search-engine-menu", AppSearchEngineMenu);
