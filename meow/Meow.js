let client = require('../client/RestClient');
let catUrl = 'https://aws.random.cat/meow';

async function getRandomCat() {
  let res = await client.GetAsync(catUrl);
  return res;
}

module.exports = {
  getRandomCat: getRandomCat
}