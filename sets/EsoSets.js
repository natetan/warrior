let base64 = require('base-64');
let client = require('../client/RestClient');

const eso_sets_api_base_url = 'https://beast.pathfindermediagroup.com/api/eso/sets';
const eso_sets_base_url = 'https://eso-sets.com/set';
const eso_sets_auth = process.env.eso_sets_token || require('../auth.json').eso_sets_token;

/**
 * Downloads all the eso sets as a json file called eso_sets.json
 */
async function DownloadSets() {
  try {
    let options = {
      'method': 'GET',
      'headers': {
        'Authorization': `Basic ${base64.encode(eso_sets_auth)}`
      }
    };
    let success = await client.SaveJsonAsync(eso_sets_api_base_url, 'eso_sets.json', options);
    if (success) {
      console.log('Completed!');
    } else {
      console.log('Unsuccessful');
    }
  } catch (err) {
    console.log(`Error with <EsoSets.DownloadSets()>: ${err}`);
  }
}

/**
 * Gets a set from eso-sets
 * 
 * @param {String} setName - name of set
 * 
 * Returns a json representation of a set
 */
async function GetSetByName(setName) {
  try {
    let options = {
      'method': 'GET',
      'headers': {
        'Authorization': `Basic ${base64.encode(eso_sets_auth)}`
      }
    };
    let url = `${eso_sets_api_base_url}/search?query=${setName}`;
    let set = await client.GetAsync(url, options);
    if (set) {
      set.forEach((s) => {
        s['url'] = `${eso_sets_base_url}/${s.slug}`
      });
    }
    return set;
  } catch (err) {
    console.log(`Error with <EsoSets.GetSetByName(${setName})>: ${err}`);
    return null;
  }
}

/**
 * Gets a set from eso-sets
 * 
 * @param {Int} id - id of set
 * 
 * Returns a json representation of a set
 */
async function GetSetById(id) {
  try {
    if (!Number(id)) {
      console.log(`<EsoSets.GetSetById(${id})>: ${id} is not a number`);
    }
    let options = {
      'method': 'GET',
      'headers': {
        'Authorization': `Basic ${base64.encode(eso_sets_auth)}`
      }
    };
    let url = `${eso_sets_api_base_url}/${id}`;
    let set = await client.GetAsync(url, options);
    if (set) {
      set['url'] = `${eso_sets_base_url}/${set.slug}`
    }
    return set;
  } catch (err) {
    console.log(`Error with <EsoSets.GetSetById(${id})>: ${err}`);
    return null;
  }
}

module.exports = {
  GetSetByName: GetSetByName,
  GetSetById: GetSetById
}