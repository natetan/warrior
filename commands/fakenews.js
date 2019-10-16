const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'fakenews',
  desc: 'FOX is not the only fake news channel.',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = await message.channel.send('Processing imgen...');
    try {
      const avatars = discordUtils.getAvatars(message, client);
      const imageURL = 'https://raw.githubusercontent.com/fu-snail/Arcane-Vortex/master/resources/images/memes/fakenews.bmp';
      let avatar = await Jimp.read(avatars.target);
      let base = await Jimp.read(imageURL);
      let baseFinal = await Jimp.read(base);
      let outputName = 'fakenews.png';

      avatar.resize(400, 400);

      await baseFinal
        .composite(avatar, 390, 0)
        .composite(base, 0, 0, {
          mode: Jimp.BLEND_SOURCE_OVER,
          opacityDest: 1,
          opacitySource: 0.5
        });

      let error, res = await baseFinal.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.Attachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <fakenews> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}