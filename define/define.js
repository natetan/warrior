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
    let result = 'Definitions:\n';
    for (var i = 0; i < json.list.length && i < 1; i++) {
      let currentLength = result.length;
      let definition = json.list[i]['definition'];
      if (currentLength + definition.length > 2000) {
        return result;
      }
      result += `${i + 1}: ${definition}\n`;
    }
    return result;
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