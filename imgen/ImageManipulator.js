let Jimp = require('jimp');

const memes = {
  'slap': slap
}

async function determineMeme(command, avatars) {
  let fn = memes[command];
  return await fn(avatars);
}
// Batman slapping Robin
async function slap(avatars) {
  let slapper = await Jimp.read(avatars[0]);
  let slapee = await Jimp.read(avatars[1]);
  let base = await Jimp.read('https://raw.githubusercontent.com/DankMemer/meme-server/master/assets/batslap/batslap.bmp');

  let outputName = 'temp.png';
  slapper.resize(200, 200);
  slapee.resize(220, 220);
  base
    .resize(1000, 500)
    .composite(slapper, 350, 70)
    .composite(slapee, 580, 260)
    .write(outputName);
  return outputName;
}

module.exports = {
  determineMeme: determineMeme
}