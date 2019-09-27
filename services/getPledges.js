let base64 = require('base-64');
let client = require('./client');

const eso_pledges_api_base_url = 'https://beast.pathfindermediagroup.com/api/eso/pledges';
const eso_sets_auth = process.env.eso_sets_token || require('../auth.json').eso_sets_token;

/**
 * Gets the daily pledges for ESO.
 * 
 * @returns {Object} json object
 */
async function getPledges() {
  let options = {
    'method': 'GET',
    'headers': {
      'Authorization': `Basic ${base64.encode(eso_sets_auth)}`
    }
  };
  let url = `${eso_pledges_api_base_url}`;
  let json = await client.get(url, options);
  if (json) { 
    let pledges = await json.json();
    return pledges.en;
  } else {
    console.log('Error in getPledges');
    return null;
  }
  
}

module.exports = getPledges;