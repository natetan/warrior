let Jimp = require('jimp');

const memes = {
  'egg': egg,
  'slap': slap,
  'shit': shit
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

async function airpods(avatars) {
  
}

async function egg(avatars) {
  let egg = await Jimp.read(avatars[1]);
  let base = await Jimp.read('https://raw.githubusercontent.com/fu-snail/Arcane-Vortex/master/resources/images/memes/egg.bmp');
  let outputName = 'egg.png';

  egg.resize(50, 50);
  base
    .resize(350, 350)
    .composite(egg, 143, 188)
    .write(outputName);
  return outputName;

}

// Batman slapping Robin
async function slap(avatars) {
  let slapper = await Jimp.read(avatars[0]);
  let slapee = await Jimp.read(avatars[1]);
  let base = await Jimp.read('https://raw.githubusercontent.com/fu-snail/Arcane-Vortex/master/resources/images/memes/slap.bmp');
  let outputName = 'slap.png';

  slapper.resize(200, 200);
  slapee.resize(220, 220);
  base
    .resize(1000, 500)
    .composite(slapper, 350, 70)
    .composite(slapee, 580, 260)
    .write(outputName);
  return outputName;
}

// Stepping in shit
async function shit(avatars) {
  let shit1 = await Jimp.read(avatars[1]);
  let shit2 = await Jimp.read(avatars[1]);
  let shit3 = await Jimp.read(avatars[1]);
  let base = await Jimp.read('https://raw.githubusercontent.com/fu-snail/Arcane-Vortex/master/resources/images/memes/shit.bmp');
  let outputName = 'shit.png';

  shit1.resize(80, 80);
  shit2.resize(80, 80);
  shit3.resize(80, 80);

  base 
    .composite(shit1, 225, 820)
    .composite(shit2, 305, 720)
    .composite(shit3, 385, 620)
    .write(outputName);
  return outputName;

}

module.exports = {
  determineMeme: determineMeme
}