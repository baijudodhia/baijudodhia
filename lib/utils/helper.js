export function isEmptyString(value) {
  return value === "";
}
export function isUndefined(value) {
  return value === undefined;
}
export function isNull(value) {
  return value === null;
}
export function isEmptyObject(object) {
  return object && Object.keys(object).length === 0 && Object.getPrototypeOf(object) === Object.prototype;
}
export function isEmptyArray(arr) {
  return Array.isArray(arr) && Array.isArray(arr) && arr.length === 0;
}
export function isEmptyValue(value) {
  if (isEmptyString(value) || isUndefined(value) || isNull(value)) {
    return true;
  } else if (isEmptyObject(value)) {
    return true;
  } else if (Array.isArray(value)) {
    if (isEmptyArray(value)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
