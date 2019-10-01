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
        return m.edit(song.message);
      }
      song = song.tracks.items[0];
      if (!song) {
        return m.edit('There was an error.');
      }
      let songEmbed = eu.createSongEmbed(song);
      return m.edit(songEmbed);
    } catch (err) {
      console.log(`ERROR: Command <song> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      return m.edit('There was an error. I am sorry for your loss.');
    }
  }
}