/**
 * Check if an array is empty
 *
 * @param {Array} arr - The array to check
 * @returns {boolean} True if the array is empty or not an array
 */
export function isEmptyArray(arr) {
  return !Array.isArray(arr) || arr.length === 0;
}

/**
 * Check if a value exists in an array
 *
 * @param {Array} arr - The array to check
 * @param {*} value - The value to find
 * @returns {boolean} True if the value exists in the array
 */
export function arrayIncludes(arr, value) {
  return Array.isArray(arr) && arr.includes(value);
}

/**
 * Get a unique array (remove duplicates)
 *
 * @param {Array} arr - The array to process
 * @returns {Array} A new array with unique values
 */
export function uniqueArray(arr) {
  if (!Array.isArray(arr)) {
    return [];
  }
  return [...new Set(arr)];
}

/**
 * Flatten an array of arrays into a single array
 *
 * @param {Array} arr - The array to flatten
 * @returns {Array} The flattened array
 */
export function flattenArray(arr) {
  if (!Array.isArray(arr)) {
    return [];
  }
  return arr.flat();
}

/**
 * Group array items by a key or function
 *
 * @param {Array} arr - The array to group
 * @param {string|Function} keyOrFn - Property name or function to group by
 * @returns {Object} An object with groups as keys and arrays as values
 */
export function groupBy(arr, keyOrFn) {
  if (!Array.isArray(arr)) {
    return {};
  }

  return arr.reduce((result, item) => {
    const key = typeof keyOrFn === "function" ? keyOrFn(item) : item[keyOrFn];

    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(item);
    return result;
  }, {});
}
