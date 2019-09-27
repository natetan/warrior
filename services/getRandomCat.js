let client = require('./client');
let catUrl = 'https://aws.random.cat/meow';

/**
 * Gets a random cat from the internet
 * 
 * @returns {Object} json object
 */
async function getRandomCat() {
  let res = await client.get(catUrl);
  if (res.status === 200) {
    return res.json();
  } else {
    console.log(`getRandomCat returned status ${res.status}`);
    return null;
  }
}

module.exports = getRandomCat;