// lib/utils/index.js - Central export point for utility functions

// Import helper functions
import { isEmptyArray } from "./array.js";
import { isEmptyObject } from "./object.js";
import { isEmptyString } from "./string.js";
import { isNull, isUndefined } from "./helper.js";

// Import component utilities
import { getComponentProps, setComponentTemplate } from "./component.js";
import { BaseComponent } from "./BaseComponent.js";
import { componentRegistry } from "./ComponentRegistry.js";
import { defineComponent } from "./defineComponent.js";

// Helper for checking if a value is empty
export function isEmptyValue(value) {
  if (value === null || value === undefined) {
    return true;
  }

  if (Array.isArray(value)) {
    return isEmptyArray(value);
  }

  if (typeof value === "object") {
    return isEmptyObject(value);
  }

  if (typeof value === "string") {
    return isEmptyString(value);
  }

  return false;
}

// Export legacy utilities (for backward compatibility)
export { isEmptyArray, isEmptyObject, isEmptyString, getComponentProps, setComponentTemplate };

// Export new component system
export { BaseComponent, componentRegistry, defineComponent };

// Attach to window for global access (for backward compatibility)
if (typeof window !== "undefined") {
  window.isEmptyArray = isEmptyArray;
  window.isEmptyObject = isEmptyObject;
  window.isEmptyString = isEmptyString;
  window.isEmptyValue = isEmptyValue;
  window.getComponentProps = getComponentProps;
  window.setComponentTemplate = setComponentTemplate;

  // New component system
  window.BaseComponent = BaseComponent;
  window.componentRegistry = componentRegistry;
  window.defineComponent = defineComponent;
}
