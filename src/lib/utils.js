/**
 * Parse JSON to JS object, return input if parsing fails
 * @param {string} str
 * @returns {object|string} Object on success or string input if fails
 */
const jsonParser = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
};

export {
  jsonParser,
};
