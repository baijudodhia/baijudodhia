const SkillsTemplate = document.createElement("template");
SkillsTemplate.innerHTML = `
    <link href='../../main.css' rel='stylesheet'>
    <style>
        #skills {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;
            align-content: center;
            row-gap: 20px;
        }
        #skills .skills-item {
            margin-bottom: 8px;
        }
        #skills .skills-title {
            margin-bottom: 3px;
        }
        #skills .skills-list {
            padding: 0px 0px 0px 0px;
        }
        .skills-conditional-breakline {
            display: none;
        }
        @media only screen and (max-width: 771px) {
            .skills-conditional-breakline {
                content: " ";
                display: block;
                height: 2px;
                line-height: 1px;
            }
        }
        #skills .skills-list-item {
            padding: 0px 4px;
            margin: 0px 6px 4px 0px;
        }
    </style>
    <div id="skills">
        <h3>Skills</h3>
    </div>
    <template id="skills-template">
        <div class="skills-item" id="skills-platforms">
            <div class="skills-title">
                <u id="skill-type"></u>:
                <br class="skills-conditional-breakline" />
                <span id="skill-list"></span>
            </div>
        </div>
    </template>
`;

class AppSkills extends HTMLElement {
	constructor() {
		super();
		// element created
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(SkillsTemplate.content.cloneNode(true));
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
		return ["language"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		// called when one of attributes listed above is modified
		if (name === "language" && oldValue !== newValue && newValue !== null && newValue !== undefined && newValue !== "") {
			this.addSectionLoader();
			this.fetchSkillsData(newValue);
		}
	}

	adoptedCallback() {
		// called when the element is moved to a new document
		// (happens in document.adoptNode, very rarely used)
	}

	// there can be other element methods and properties
	async fetchSkillsData(language = "en") {
		const response = await fetch(`/data/skills/${language}.skills.json`);
		const data = await response.json();
		this.loadSkills(data["skills"]);
	}

	loadSkills(data) {
		if ("content" in document.createElement("template")) {
			let skillsContainer = document.createElement("div");
			skillsContainer.setAttribute("id", "skills-container");
			skillsContainer.innerHTML = "";
			let skillsTemplate = this.shadowRoot.querySelector("#skills-template");
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					const val = data[key];
					var clone = skillsTemplate.content.cloneNode(true);
					clone.querySelector("#skill-type").innerText = val["skillType"];
					clone.querySelector("#skill-list").innerText = val["skillList"].join(", ");
					skillsContainer.appendChild(clone);
				}
			}
			this.removeSectionLoader();
			this.shadowRoot.querySelector("#skills").append(skillsContainer);
		}
	}

	addSectionLoader() {
		const sectionLoader = document.createElement("div");
		sectionLoader.setAttribute("class", "section-loader");

		const skills = this.shadowRoot.querySelector("#skills");
		skills.append(sectionLoader);
	}

	removeSectionLoader() {
		this.shadowRoot.querySelector(".section-loader").remove();
	}
}

customElements.define("app-skills", AppSkills);
