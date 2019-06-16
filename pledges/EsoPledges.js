let base64 = require('base-64');
let client = require('../client/RestClient');

const eso_pledges_api_base_url = 'https://beast.pathfindermediagroup.com/api/eso/pledges';
const eso_sets_auth = process.env.eso_sets_token || require('../auth.json').eso_sets_token;

async function getPledges() {
  let options = {
    'method': 'GET',
    'headers': {
      'Authorization': `Basic ${base64.encode(eso_sets_auth)}`
    }
  };
  let url = `${eso_pledges_api_base_url}`;
  let pledges = await client.GetAsync(url, options);
  if (pledges) { 
    return pledges.en;
  }
  return null;
}

module.exports = {
  getPledges: getPledges
}