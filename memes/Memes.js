let restClient = require('../client/RestClient');

const memes_base_url = 'https://meme-api.herokuapp.com/gimme';

async function getRandomMeme(subreddit) {
  let url = memes_base_url;
  if (subreddit) {
    url = `${memes_base_url}/${subreddit}`;
  }
  let res = await restClient.GetAsync(url);
  return res;
}

module.exports = {
  getRandomMeme: getRandomMeme
}