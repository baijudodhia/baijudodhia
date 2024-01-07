function isEmptyString(value) {
  return value === "";
}
function isUndefined(value) {
  return value === undefined;
}
function isNull(value) {
  return value === null;
}
function isEmptyObject(object) {
  return object && Object.keys(object).length === 0 && Object.getPrototypeOf(object) === Object.prototype;
}
function isEmptyArray(arr) {
  return Array.isArray(arr) && Array.isArray(arr) && arr.length === 0;
}
function isEmptyValue(value) {
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
