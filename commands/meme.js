const getMeme = require('../services/getMeme');
const eu = require('../utils/embedUtils');

module.exports = {
  name: 'meme',
  desc: 'Random meme from r/memes, r/dankmemes, r/meirl, or a specified one.',
  usage: '[subreddit]',
  commandType: 'General',
  async execute(message, args, client) {
    let subreddit = args.join('');
    let m;
    if (subreddit) {
      m = await message.channel.send(`Fetching meme from r/${subreddit}`);
    } else {
      m = await message.channel.send('Fetching random meme from r/memes, r/dankmemes, and r/meirl');
    }
    try {
      let meme = await getMeme(subreddit);
      if (meme.status_code && meme.status_code === 404) {
        return m.edit(`Subreddit r/${subreddit} not found.`);
      }
      let embed = eu.createMemeEmbed(meme);
      return m.edit(embed);
    } catch (err) {
      console.log(`There was an error: ${err}`);
      return m.edit('Sorry, an error occured.');
    }
  }
}