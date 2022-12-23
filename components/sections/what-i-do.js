const WhatIDoTemplate = document.createElement("template");
WhatIDoTemplate.innerHTML = `
    <link href='../../main.css' rel='stylesheet'>
    <style>
        #what-i-do {
            display: flex;
            flex-direction: column;
            align-content: center;
            justify-content: center;
            align-items: stretch;
            row-gap: 20px;
        }
        #what-i-do-container {
            display: flex;
            align-items: stretch;
            justify-content: center;
            align-content: center;
            flex-direction: row;
            column-gap: 20px;
        }
        @media only screen and (max-width: 931px) {
            #what-i-do-container {
                display: flex;
                justify-content: center;
                align-content: center;
                flex-direction: column;
                align-items: stretch;
                row-gap: 20px;
            }
        }
        .what-i-do-left {
            flex-basis: 0;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-content: center;
            justify-content: center;
            align-items: stretch;
            row-gap: 20px;
        }
        .what-i-do-divider {
            display: block;
            align-self: stretch;
            border-right: 1.5px dashed var(--color-bw_secondary_invert);
        }
        @media only screen and (max-width: 931px) {
            .what-i-do-divider {
            display: none;
            }
        }
        .what-i-do-right {
            flex-basis: 0;
            flex-grow: 1;
        }
    </style>
    <div id="what-i-do">
        <h3>What I Do ?</h3>
        <div id="what-i-do-container">
            <div class="what-i-do-left">
                <div>
                    I work primarily in JavaScript, Python and Web Development with
                    great flexibility of learning and adapting to any programming
                    language or technology.
                </div>
                <div>
                    Apart from coding and technology, pretty much involved in
                    exploring and learning about better design techniques, digital
                    marketing, entrepreneurship and startups, business and project
                    management.
                </div>
            </div>
            <div class="what-i-do-divider"></div>
            <div class="what-i-do-right">
                <span>
                    I have been a part of a lot of student communities related to tech, startups and entrepreneurship during my undergraduate years such as
                </span>
                <br />
                <app-link
                    title="BloomBox, E-Cell KJSCE"
                    link="https://www.bloomboxkjsce.com/"
                ></app-link>
                ,&nbsp;<br />
                <app-link
                    title="RedShift Racing India"
                    link="http://www.redshift-racing.in/"
                ></app-link>
                ,&nbsp;<br />
                <app-link
                    title="CSI KJSCE"
                    link="https://www.csikjsce.org/"
                ></app-link>
                ,&nbsp;<br />
                <app-link
                    title="Hult Prize Somaiya"
                    link="https://www.hultprize.org/"
                ></app-link>
            </div>
        </div>
    </div>
`;

class AppWhatIDo extends HTMLElement {
    constructor() {
        super();
        // element created
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(WhatIDoTemplate.content.cloneNode(true));
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
}

customElements.define("app-what-i-do", AppWhatIDo);
