const langs = require('./languages');

/**
* Returns the ISO 639-1 code of the desiredLang – if it is supported by Google Translate
* @param {string} desiredLang – the name or the code of the desired language
* @returns {string|boolean} The ISO 639-1 code of the language or false if the language is not supported
*/
function getCode(desiredLang) {
  if (!desiredLang) {
    return false;
  }
  desiredLang = desiredLang.toLowerCase();

  // If the ISO 639-1 code itself is given, return it if it exists
  if (langs[desiredLang]) {
    return desiredLang;
  }

  // Gets the ISO 639-1 code associated with the desired language
  // We create an array of the keys, and then filter it by a function
  // Returns an array of size 1
  let keys = Object.keys(langs).filter((key) => {
    if (typeof langs[key] !== 'string') {
      return false;
    }

    return langs[key].toLowerCase() === desiredLang;
  });

  return keys[0] || false;
}

/**
* Returns true if the desiredLang is supported by Google Translate and false otherwise
* @param desiredLang – the ISO 639-1 code or the name of the desired language
* @returns {boolean}
*/
function isSupported(desiredLang) {
  return Boolean(getCode(desiredLang));
}

module.exports = {
  getCode: getCode,
  isSupported: isSupported,
}