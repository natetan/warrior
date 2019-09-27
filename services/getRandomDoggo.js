let client = require('./client');
let doggoUrl = 'https://random.dog/woof.json';

/**
 * Gets a random dog media (png, jpg, gif, wmv).
 */
async function getRandomDoggo() {
  let res = await client.get(doggoUrl);
  return res;
}

module.exports = getRandomDoggo;