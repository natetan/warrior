let Jimp = require('jimp');

const memes = {
  'egg': egg,
  'slap': slap
}

/**
 * 
 * @param {String} command -- meme command
 * @param {Array} avatars -- list of avatarURLs
 * @param {String} originUser -- Username of message sender
 * @param {String} targetUser -- Username of target - NULLABLE
 */
async function determineMeme(command, avatars, originUser, targetUser) {
  let fn = memes[command];
  return await fn(avatars, originUser, targetUser);
}

async function egg(avatars) {
  
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