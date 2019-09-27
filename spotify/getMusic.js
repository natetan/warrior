const Spotify = require('node-spotify-api');

const spotify = new Spotify({
  id: process.env.spotify_client_id || require('../auth.json').spotify_client_id,
  secret: process.env.spotify_client_secret || require('../auth.json').spotify_client_secret
});

async function getMusic(query) {
  let err, data = await spotify.search({ type: 'track', query: query })
  if (err) {
    let message = `Get song error: ${err}`;
    console.log(message);
    return null;
  }
  if (!data.tracks.items.length) {
    return new Error('No tracks were found.');
  }
  return data;
}

module.exports = getMusic;