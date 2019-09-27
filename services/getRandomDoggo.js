let client = require('./client');
let doggoUrl = 'https://random.dog/woof.json';

/**
 * Gets a random dog media (png, jpg, gif, wmv).
 * 
 * @returns {Object} json object
 */
async function getRandomDoggo() {
  let res = await client.get(doggoUrl);
  if (res.status === 200) {
    return res.json();
  } else {
    console.log(`getRandomDoggo returned status ${res.status}`);
    return null;
  }

}

module.exports = getRandomDoggo;