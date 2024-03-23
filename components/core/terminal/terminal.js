class AppTerminalComponent extends HTMLElement {
  constructor(
    props = {
      id: "button",
      config: {},
      loading: false,
    },
    basePath = "/components/core/terminal",
    templateUrl = "/components/core/terminal/terminal.html",
    templateStyleUrls = [
      "/assets/styles/index.css",
      "/components/core/terminal/terminal.css",
      "https://baijudodhia.github.io/cdn/font-awesome-5.15.4/icons/all.min.css",
    ],
  ) {
    super();

    this.props = props;
    this.basePath = basePath;
    this.templateUrl = templateUrl;
    this.templateStyleUrls = templateStyleUrls;

    this.currentCommandInput = "";
    this.historyCommandInputs = [];
    this.historyCommandLength = this.historyCommandInputs.length;
    this.activeHistoryCommandIndex = -1;

    setComponentTemplate.call(
      this,
      () => {
        this.render();
      },
      () => {
        console.log("Initial setup failed!");
      },
    );
  }

  /**
   * 1. Browser calls this method when the element is added to the document.
   * 2. Can be called many times if an element is repeatedly added/removed.
   */
  connectedCallback() {}

  /**
   * 1. Browser calls this method when the element is removed from the document.
   * 2. Can be called many times if an element is repeatedly added/removed.
   */
  disconnectedCallback() {}

  static get observedAttributes() {
    return ["id", "config", "loading"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && newValue) {
      this.props[name] = newValue;
      this.render();
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  getElement() {
    if (!this.shadowRoot) {
      return null;
    }

    const element = this.shadowRoot.querySelector("#terminal");
    if (element) {
      element.remove();
    }

    let terminal = document.createElement("div");
    terminal.classList.add("terminal");
    terminal.setAttribute("id", "terminal");
    terminal.innerHTML = "";

    this.shadowRoot.appendChild(terminal);

    return terminal;
  }

  getTemplate() {
    return this.shadowRoot.querySelector("#terminal-template");
  }

  getTemplateClone(template) {
    return template.content.cloneNode(true);
  }

  render() {
    this.props = getComponentProps.call(this, this.props);
    const terminal = this.getElement();

    if (terminal && "content" in document.createElement("template")) {
      const itemTemplate = this.getTemplateClone(this.getTemplate());

      // Apply data-attributes directly to the button element
      Object.keys(this.props).forEach((key) => {
        let value = this.props[key];

        if (!isEmptyValue(value)) {
          if (key === "config") {
            terminal.setAttribute(`${key}`, value);
          } else if (key === "id") {
            terminal.setAttribute(`${key}`, value);
          }
        }

        itemTemplate
          .querySelector("#terminal-input")
          .addEventListener("keydown", (e) => this.handleOnKeydownTerminalInput(e));
      });

      if (this.props.loading === "true") {
        // Render loading animations
        const loadingAnimationContainer = document.createElement("div");
        loadingAnimationContainer.setAttribute("id", "loader-container");

        const loadingAnimation = document.createElement("div");
        loadingAnimation.setAttribute("id", "loader");
        loadingAnimation.setAttribute("data-appearance", this.props.appearance);
        loadingAnimation.setAttribute("data-size", this.props.size);
        loadingAnimation.setAttribute("disabled", true);

        loadingAnimationContainer.appendChild(loadingAnimation.cloneNode(true));

        terminal.innerHTML = ""; // Clear existing content
        terminal.appendChild(loadingAnimationContainer.cloneNode(true));
      } else {
        // Render children
        terminal.innerHTML = ""; // Clear existing content
        terminal.appendChild(itemTemplate);
      }
    }
  }

  handleOnUpdateTerminalHistoryIndex() {
    this.activeHistoryCommandIndex = this.historyCommandInputs.length - 1;
  }

  handleOnUpdateTerminalStack(command) {
    if (command) {
      this.historyCommandInputs.unshift(command);
    }
  }

  handleOnClearTerminalInput() {
    this.currentCommandInput = "";
    this.shadowRoot.querySelector("#terminal-input").value = "";
  }

  handleOnSetTerminalInput(value) {
    this.currentCommandInput = value;
    this.shadowRoot.querySelector("#terminal-input").value = value;
  }

  handleOnClearTerminalOutput() {
    this.shadowRoot.querySelector(".output").innerHTML = "";
  }

  handleOnSetTerminalOutput(newValue) {
    if (this.isCommand(newValue)) {
      this.handleCommand(newValue);
    } else {
      const div = document.createElement("div");
      div.innerText = newValue;

      this.shadowRoot.querySelector(".output").prepend(div.cloneNode(true));
    }
  }

  acceptedCommands = ["clear", "cls"];

  isCommand(command) {
    return this.acceptedCommands.includes(command);
  }

  handleCommand(command) {
    if (this.isCommand(command)) {
      switch (command) {
        case "clear":
        case "cls":
          this.handleOnClearTerminalOutput();
          break;
        default:
          break;
      }
    }
  }

  handleOnKeydownTerminalInput(e) {
    switch (e.key) {
      case "Enter":
        /**
         * 1. Push the command to stack.
         * 2. Update the active index to recent command's index.
         * 3. Show the command in the output view.
         * 4. Clear the input box and input value.
         */

        e.preventDefault();

        if (this.isCommand(this.currentCommandInput)) {
          this.handleOnUpdateTerminalStack(this.currentCommandInput);
          this.activeHistoryCommandIndex = -1;
        }
        this.handleOnSetTerminalOutput(this.currentCommandInput);
        this.handleOnClearTerminalInput();

        break;
      case "ArrowUp":
        if (this.activeHistoryCommandIndex < this.historyCommandInputs.length - 1) {
          e.preventDefault();

          this.activeHistoryCommandIndex += 1;

          const previousCommand = this.historyCommandInputs[this.activeHistoryCommandIndex];

          this.handleOnSetTerminalInput(previousCommand);
        }
        break;
      case "ArrowDown":
        if (this.activeHistoryCommandIndex > 0) {
          e.preventDefault();

          this.activeHistoryCommandIndex -= 1;

          const nextCommand = this.historyCommandInputs[this.activeHistoryCommandIndex];

          this.handleOnSetTerminalInput(nextCommand);
        }
        break;
      default:
        const key = e.key;
        console.log(key);

        switch (key) {
          case "Backspace":
            this.currentCommandInput = this.currentCommandInput.slice(0, -1);
            break;
          default:
            const regex = new RegExp("^.$");
            if (!regex.test(key)) {
              return;
            } else {
              this.currentCommandInput = this.shadowRoot.querySelector("#terminal-input").value + key;
            }
            break;
        }

        break;
    }
  }
}

customElements.define("app-terminal", AppTerminalComponent);
