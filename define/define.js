const fetch = require('node-fetch');

const oxfordBaseUrl = 'https://od-api.oxforddictionaries.com/api/v1/entries/en';
const urbanDictionaryBaseUrl = `http://api.urbandictionary.com/v0/define?term=`;

/**
 * Gets the definition from Oxford dictionary. Chooses the first definition
 * 
 * @param {String} term 
 */
async function getDefinition(term) {
  let options = {
    method: 'GET',
    headers: {
      'app_id': process.env.oxford_app_id || require('../auth.json').oxford_app_id,
      'app_key': process.env.oxford_app_key || require('../auth.json').oxford_app_key
    }
  }
  term = term.toLowerCase();
  let res = await fetch(`${oxfordBaseUrl}/${term}`, options);
  if (res.status === 200) {
    return res.json();
  } else {
    return {
      'error': res.status,
      'errorMessage': res.statusText
    }
  }
}

/**
 * Gets the definition from urban dictionary. Randomly chooses a definition that is less
 * than 160 words.
 * 
 * @param {String} term 
 */
async function getUrbanDefinition(term) {
  term = term.toLowerCase();
  let res = await fetch(`${urbanDictionaryBaseUrl}${term}`);
  if (res.status === 200) {
    let json = await res.json();
    let results = json.list;
    let length = results.length;
    if (length === 0) {
      return;
    }
    let definition = results[Math.floor(Math.random() * length)]['definition'];
    let tries = 5;
    let characterLimit = 200;
    while (definition.length > characterLimit && tries > 0) {
      definition = results[Math.floor(Math.random() * length)]['definition'];
      tries--;
    }
    if (tries < 1) {
      definition = `After 5 tries, I could not find a definition that is less than ${characterLimit} characters.`;
    }
    // Use Regex to replace all square brackets
    definition = (definition + '').replace(/[\[\]']+/g, '');
    return definition;
  } else {
    return {
      'error': res.status,
      'errorMessage': res.statusText
    }
  }
}

module.exports = {
  getDefinition: getDefinition,
  getUrbanDefinition: getUrbanDefinition
}