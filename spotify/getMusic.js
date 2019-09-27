const Spotify = require('node-spotify-api');

const spotify = new Spotify({
  id: 'aa2d97378a1f4386a960c650039f5e4f',
  secret: '4c4c035cf2c74da397b2434ef9b62b2c'
});

async function getMusic(query) {
  let err, data = await spotify.search({ type: 'track', query: query })
  if (err) {
    let message = `Get song error: ${err}`;
    return null;
  }
  return data;
}

module.exports = getMusic;