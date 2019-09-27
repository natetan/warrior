let client = require('./client');

const memes_base_url = 'https://meme-api.herokuapp.com/gimme';

/**
 * Gets a meme from given subreddit (random picture).
 * If no subreddit is provided, it will get a random
 * one from r/dankmemes, r/memes, and r/me_irl
 * @param {String} subreddit subreddit
 * 
 * @returns {Object} json object
 */
async function getMeme(subreddit = null) {
  let url = memes_base_url;
  if (subreddit) {
    url = `${memes_base_url}/${subreddit}`;
  }
  let res = await client.get(url);
  if (res.status === 200) {
    return res.json();
  } else {
    console.log(`getMeme returned status ${res.status}`);
    return null;
  }
}

module.exports = getMeme;