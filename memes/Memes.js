let restClient = require('../client/RestClient');

const memes_base_url = 'https://meme-api.herokuapp.com/gimme';

async function getRandomMeme() {
  let res = await restClient.GetAsync(memes_base_url);
  return res;
}

module.exports = {
  getRandomMeme: getRandomMeme
}