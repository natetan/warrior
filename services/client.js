let fetch = require('node-fetch');
let fs = require('fs');

/**
 * Gets a json response from the endpoint
 * 
 * @param {string} url url
 * @param {Object} options request options (optional)
 * 
 * @returns {Promise} Promise
 */
async function get(url, options = {}) {
  try {
    let res = await fetch(url, options);
    return res;
  } catch (err) {
    console.log(`Error in <RestClient.getAsync()>: ${err}`);
    return null;
  }
}

/**
 * Saves json into a file
 * 
 * @param {string} url url
 * @param {string} fileName name of the file to save
 * @param {Object} options request options (optional)
 * 
 * Returns true if successful and false otherwise
 */
async function saveJson(url, fileName, options = {}) {
  try {
    let json = await get(url, options);
    await fs.writeFileSync(fileName, JSON.stringify(json, null, 2), (err) => {
      console.log(`File save error: ${err}`);
    });
    return true;
  } catch (e) {
    console.log(`Error in <RestClient.SaveJsonAsync()>: ${err}`);
    return false;
  }
}

module.exports = {
  get,
  saveJson
}