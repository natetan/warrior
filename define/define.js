const fetch = require('node-fetch');

const oxfordBaseUrl = 'https://od-api.oxforddictionaries.com/api/v1/entries/en';
const urbanDictionaryBaseUrl = `http://api.urbandictionary.com/v0/define?term=`;

async function getDefinition(term) {
  let options = {
    method: 'GET',
    headers: {
      'app_id': process.env.oxford_app_id || require('../auth.json').oxford_app_id,
      'app_key': process.env.oxford_app_key || require('../auth.json').oxford_app_key
    }
  }
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

async function getUrbanDefinition(term) {
  let res = await fetch(`${urbanDictionaryBaseUrl}${term}`);
  if (res.status === 200) {
    let json = await res.json();
    let results = json.list;
    let length = results.length;
    let definition = results[Math.floor(Math.random() * length)]['definition'];
    let tries = 5;
    while (definition.length > 160 && tries > 0) {
      definition = results[Math.floor(Math.random() * length)]['definition'];
    }
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