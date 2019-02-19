const fetch = require('node-fetch');

const oxfordBaseUrl = 'https://od-api.oxforddictionaries.com/api/v1/entries/en';

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

module.exports = {
  getDefinition: getDefinition
}