const ColorChangerTemplate = document.createElement("template");
ColorChangerTemplate.innerHTML = `
    <link href='./portfolio/main.css' rel='stylesheet'>
    <style>
		.color-changer {
			display: flex;
			align-items: center;
			justify-content: center;
			align-content: center;
			flex-direction: row;
		}
		input[type="color"] {
			-webkit-appearance: none;
			border: none;
			width: 22px;
			height: 22px;
			padding: 0px;
			border-radius: 100px;
			background-color: transparent;
			cursor: pointer;
			box-shadow: 0px 0px 5px -2px var(--color-secondary);
		}
		input[type="color"]::-webkit-color-swatch-wrapper {
			padding: 0;
			width: 22px;
			height: 22px;
		}
		input[type="color"]::-webkit-color-swatch {
			border: none;
			width: 22px;
			height: 22px;
			border-radius: 100px;
		}
	</style>
    <div class="color-changer">
        <input type="color" id="color-changer-input" title="Website Color Theme Changer" onchange="changeThemeColor(this.value);"/>
    </div>
`;

class AppColorChanger extends HTMLElement {
  constructor() {
    super();
    // element created
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(ColorChangerTemplate.content.cloneNode(true));

    const color_changer = this.shadowRoot.getElementById("color-changer-input");
    color_changer.value = HSLToHex(
      getComputedStyle(document.documentElement, null).getPropertyValue("--color-primary"),
    );
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
    return ["color"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
    if (name === "color") {
      if (oldValue != newValue) {
        const color_changer = this.shadowRoot.getElementById("color-changer-input");
        color_changer.value = HSLToHex(newValue);
      }
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  // there can be other element methods and properties
}

customElements.define("app-color-changer", AppColorChanger);
