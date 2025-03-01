/**
 * Check if an object is empty
 *
 * @param {Object} obj - The object to check
 * @returns {boolean} True if the object is empty or not an object
 */
export function isEmptyObject(obj) {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return true;
  }

  return Object.keys(obj).length === 0;
}

/**
 * Deep merge two or more objects
 *
 * @param {Object} target - The target object
 * @param {...Object} sources - The source objects
 * @returns {Object} The merged object
 */
export function deepMerge(target, ...sources) {
  if (!sources.length) return target;

  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * Check if a value is an object
 *
 * @param {*} item - The value to check
 * @returns {boolean} True if the value is an object
 */
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Pick specific properties from an object
 *
 * @param {Object} obj - The source object
 * @param {Array<string>} keys - The keys to pick
 * @returns {Object} A new object with only the picked properties
 */
export function pick(obj, keys) {
  if (!obj || typeof obj !== "object") {
    return {};
  }

  return keys.reduce((result, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}

/**
 * Omit specific properties from an object
 *
 * @param {Object} obj - The source object
 * @param {Array<string>} keys - The keys to omit
 * @returns {Object} A new object without the omitted properties
 */
export function omit(obj, keys) {
  if (!obj || typeof obj !== "object") {
    return {};
  }

  return Object.keys(obj)
    .filter((key) => !keys.includes(key))
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}
