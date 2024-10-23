// lib/utils/index.js
import { getComponentProps, setComponentTemplate } from "./component.js";
import { isEmptyArray, isEmptyObject, isEmptyString, isEmptyValue, isNull, isUndefined } from "./helper.js";

// Re-exporting utility functions as named exports
export {
  getComponentProps,
  isEmptyArray,
  isEmptyObject,
  isEmptyString,
  isEmptyValue,
  isNull,
  isUndefined,
  setComponentTemplate,
};

// Attach functions to the global window object for accessibility
window.getComponentProps = getComponentProps;
window.isEmptyArray = isEmptyArray;
window.isEmptyObject = isEmptyObject;
window.isEmptyString = isEmptyString;
window.isEmptyValue = isEmptyValue;
window.isNull = isNull;
window.isUndefined = isUndefined;
window.setComponentTemplate = setComponentTemplate;
