let client = require('./client');
let foxUrl = 'https://randomfox.ca/floof/';

/**
 * Gets a random fox from the internet
 * 
 * @returns {Object} json object
 */
async function getRandomFox() {
  let res = await client.get(foxUrl);
  if (res.status === 200) {
    return res.json();
  } else {
    console.log(`getRandomFox returned status ${res.status}`);
    return null;
  }
}

module.exports = getRandomFox;