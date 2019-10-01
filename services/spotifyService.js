const Spotify = require('node-spotify-api');

const spotify = new Spotify({
  id: process.env.spotify_client_id || require('../auth.json').spotify_client_id,
  secret: process.env.spotify_client_secret || require('../auth.json').spotify_client_secret
});

/**
 * Gets song data from Spotify
 * 
 * @param {String} query queries a song from Spotify
 * @returns {Object} json representing a song
 */
async function getMusic(type, query) {
  let err, data = await spotify.search({ type: type, query: query })
  if (err) {
    let message = `Spotify search error: ${err}`;
    console.log(message);
    return null;
  }
  if (type === 'track') {
    if (!data.tracks.items.length) {
      return new Error('No tracks were found.');
    }
  } else if (type === 'album') {
    if (!data.albums.items.length) {
      return new Error('No albums were found.');
    }
  }
  return data;
}

async function getTracksForAlbum(albumId) {
  let err, data = await spotify.request(`https://api.spotify.com/v1/albums/${albumId}/tracks`);
  if (err) {
    let message = `Spotify request error: ${err}`;
    console.log(message);
    return null;
  }
  if (!data.items.length) {
    return new Error('No tracks were found.');
  }
  return data;
}

module.exports = {
  getMusic,
  getTracksForAlbum
};