/**
 * Check if a string is empty
 *
 * @param {string} str - The string to check
 * @returns {boolean} True if the string is empty or not a string
 */
export function isEmptyString(str) {
  return typeof str !== "string" || str.trim() === "";
}

/**
 * Convert a string to camelCase
 *
 * @param {string} str - The string to convert
 * @returns {string} The camelCase string
 */
export function toCamelCase(str) {
  if (typeof str !== "string") {
    return "";
  }

  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
    .replace(/\s+/g, "")
    .replace(/[-_]+/g, "");
}

/**
 * Convert a string to kebab-case
 *
 * @param {string} str - The string to convert
 * @returns {string} The kebab-case string
 */
export function toKebabCase(str) {
  if (typeof str !== "string") {
    return "";
  }

  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .replace(/_+/g, "-")
    .toLowerCase();
}

/**
 * Convert a string to PascalCase
 *
 * @param {string} str - The string to convert
 * @returns {string} The PascalCase string
 */
export function toPascalCase(str) {
  if (typeof str !== "string") {
    return "";
  }

  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\s+/g, "")
    .replace(/[-_]+/g, "");
}

/**
 * Truncate a string to a specified length
 *
 * @param {string} str - The string to truncate
 * @param {number} length - The maximum length
 * @param {string} [suffix='...'] - The suffix to add to truncated strings
 * @returns {string} The truncated string
 */
export function truncate(str, length, suffix = "...") {
  if (typeof str !== "string") {
    return "";
  }

  if (str.length <= length) {
    return str;
  }

  return str.substring(0, length) + suffix;
}
