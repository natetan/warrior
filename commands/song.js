const { getMusic } = require('../services/spotifyService');
const eu = require('../utils/embedUtils');

module.exports = {
  name: 'song',
  desc: 'Gets a song from Spotify.',
  args: true,
  usage: '<query>',
  commandType: 'general',
  async execute(message, args, client) {
    let query = args.join(' ');
    try {
      let m = await message.channel.send('Fetching song from spotify...');
      let song = await getMusic('track', query);
      if (song instanceof Error) {
        message.channel.send(song.message);
        return m.delete();
      }
      song = song.tracks.items[0];
      if (!song) {
        message.channel.send('There was an error.');
        return m.delete();
      }
      const songEmbed = eu.createSong(song);
      message.channel.send(songEmbed);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <song> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      message.channel.send('There was an error. I am sorry for your loss.');
      return m.delete();
    }
  }
}