const { getMusic, getTracksForAlbum } = require('../services/spotifyService');
const eu = require('../utils/embedUtils');

module.exports = {
  name: 'album',
  desc: 'Gets an album from Spotify.',
  args: true,
  usage: '<query>',
  commandType: 'general',
  async execute(message, args, client) {
    let query = args.join(' ');
    try {
      let m = await message.channel.send('Fetching album from spotify...');
      let album = await getMusic('album', query);
      if (album instanceof Error) {
        return message.channel.send(album.message);
      }
      album = album.albums.items[0];
      if (!album) {
        return message.channel.send('There was an error.');
      }
      let tracks = await getTracksForAlbum(album.id);
      if (tracks instanceof Error) {
        return message.channel.send(tracks.message);
      }
      tracks = tracks.items;
      let albumEmbed = eu.createAlbumEmbed(album, tracks);
      await message.channel.send(albumEmbed);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <album> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      return message.channel.send('There was an error. I am sorry for your loss.');
    }
  }
}