/**
 * Helper function to define and register web components
 *
 * @param {string} tagName - The custom element tag name (must contain a hyphen)
 * @param {typeof HTMLElement} componentClass - The component class (must extend HTMLElement)
 * @param {Object} [options] - Additional options for customElements.define
 * @returns {typeof HTMLElement} The component class
 */
import { componentRegistry } from "./ComponentRegistry.js";

export function defineComponent(tagName, componentClass, options = {}) {
  if (!tagName || typeof tagName !== "string") {
    throw new Error("Tag name must be a non-empty string");
  }

  if (!tagName.includes("-")) {
    throw new Error("Custom element tag names must contain a hyphen (-)");
  }

  if (!componentClass || typeof componentClass !== "function") {
    throw new Error("Component class must be a constructor function");
  }

  if (!(componentClass.prototype instanceof HTMLElement)) {
    throw new Error("Component class must extend HTMLElement");
  }

  try {
    // Register the component with the browser
    customElements.define(tagName, componentClass, options);

    // Add to our registry
    componentRegistry.define(tagName, componentClass);

    // Log registration (in development mode only)
    if (process.env.NODE_ENV !== "production") {
      console.log(`Component registered: ${tagName}`);
    }

    return componentClass;
  } catch (error) {
    // Handle errors (e.g., already defined)
    console.error(`Failed to register component ${tagName}:`, error);
    throw error;
  }
}
