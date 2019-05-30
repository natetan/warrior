let client = require('../client/RestClient');
let doggoUrl = 'https://random.dog/woof.json';

async function getRandomDoggo() {
  let res = await client.GetAsync(doggoUrl);
  return res;
}

module.exports = {
  getRandomDoggo: getRandomDoggo
}