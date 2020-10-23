const { getMusic, getTracksForAlbum } = require('../services/spotifyService');
const eu = require('../utils/embedUtils');

module.exports = {
  name: 'album',
  desc: 'Gets an album from Spotify.',
  args: true,
  usage: '<query>',
  commandType: 'general',
  async execute(message, args, client) {
    const query = args.join(' ');
    let m = '';
    try {
      m = await message.channel.send('Fetching album from spotify...');
      let album = await getMusic('album', query);
      if (album instanceof Error) {
        message.channel.send(album.message);
        return m.delete();
      }
      album = album.albums.items[0];
      if (!album) {
        return message.channel.send('There was an error.');
      }
      let tracks = await getTracksForAlbum(album.id);
      if (tracks instanceof Error) {
        message.channel.send(tracks.message);
        return m.delete();
      }
      tracks = tracks.items;
      const albumEmbed = eu.createAlbum(album, tracks);
      await message.channel.send(albumEmbed);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <album> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.delete();
      return message.channel.send('There was an error. I am sorry for your loss.');
    }
  }
}