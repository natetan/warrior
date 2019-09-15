const fetch = require('node-fetch');

const oxfordBaseUrl = 'https://od-api.oxforddictionaries.com/api/v2/entries/en';
const urbanDictionaryBaseUrl = `http://api.urbandictionary.com/v0/define?term=`;


/**
 * Gets the definition from Oxford dictionary. Randomly chooses a definition
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
    let json = await res.json();

    const results = json.results;
    const lexicalEntries = results[getRandomArrayIndex(results)];
    const entries = lexicalEntries.lexicalEntries[getRandomArrayIndex(Object.keys(lexicalEntries.lexicalEntries))];
    const senses = entries.entries[getRandomArrayIndex(Object.keys(entries.entries))];
    const definitions = senses.senses[getRandomArrayIndex(Object.keys(senses.senses))];

    let definition = definitions.definitions[getRandomArrayIndex(definitions.definitions)];
    let examples = definitions.examples;
    let lexicalCategory = entries.lexicalCategory.text;
    return {
      term: term,
      definition: definition,
      examples: examples,
      lexicalCategory: lexicalCategory
    }
  } else {
    return {
      'error': res.status,
      'errorMessage': res.statusText
    }
  }
}

function getRandomArrayIndex(array) {
  return Math.floor(Math.random() * array.length);
}

/**
 * Gets the definition from urban dictionary. Randomly chooses a definition that is less
 * than 300 characters.
 * 
 * @param {String} term 
 */
async function getUrbanDefinition(term) {
  term = term.toLowerCase();
  let res = await fetch(`${urbanDictionaryBaseUrl}${term}`);
  if (res.status === 200) {
    let json = await res.json();
    let results = json.list;
    const characterLimit = 300;
    results = results.filter((r) => {
      return r.definition.length <= characterLimit;
    });
    let length = results.length;
    if (!length) {
      return;
    }
    let definition = results[Math.floor(Math.random() * length)]['definition'];
    
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