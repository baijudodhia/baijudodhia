// ComponentRegistry.js - Manages component definitions and registration

/**
 * Component Registry
 * Manages component definitions and registrations
 */
export class ComponentRegistry {
  constructor() {
    // Map of component definitions (tagName -> componentClass)
    this._components = new Map();

    // Set of registered tag names
    this._registeredTags = new Set();
  }

  /**
   * Register a new component
   *
   * @param {string} tagName - The custom element tag name
   * @param {typeof HTMLElement} componentClass - The component class
   * @returns {typeof HTMLElement} The registered component class
   */
  define(tagName, componentClass) {
    // Format tag name (ensure lowercase and contains hyphen)
    const formattedTagName = this._formatTagName(tagName);

    // Check if already registered
    if (this._registeredTags.has(formattedTagName)) {
      console.warn(`Component with tag name "${formattedTagName}" is already registered.`);
      return this._components.get(formattedTagName);
    }

    // Store component definition
    this._components.set(formattedTagName, componentClass);
    this._registeredTags.add(formattedTagName);

    return componentClass;
  }

  /**
   * Check if a component is registered
   *
   * @param {string} tagName - The custom element tag name
   * @returns {boolean} True if the component is registered
   */
  isRegistered(tagName) {
    const formattedTagName = this._formatTagName(tagName);
    return this._registeredTags.has(formattedTagName);
  }

  /**
   * Get a registered component definition
   *
   * @param {string} tagName - The custom element tag name
   * @returns {typeof HTMLElement|null} The component class or null if not found
   */
  getComponent(tagName) {
    const formattedTagName = this._formatTagName(tagName);
    return this._components.get(formattedTagName) || null;
  }

  /**
   * Get all registered components
   *
   * @returns {Map<string, typeof HTMLElement>} Map of all registered components
   */
  getAllComponents() {
    return new Map(this._components);
  }

  /**
   * Format tag name (ensure lowercase and contains hyphen)
   *
   * @private
   * @param {string} tagName - The tag name to format
   * @returns {string} The formatted tag name
   */
  _formatTagName(tagName) {
    return tagName.toLowerCase();
  }
}

// Create and export a singleton instance
export const componentRegistry = new ComponentRegistry();

// Export the class for testing or extension
export default ComponentRegistry;
