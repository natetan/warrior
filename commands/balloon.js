const Discord = require('discord.js');
const stringUtils = require('../utils/stringUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'balloon',
  desc: 'The blade [2] does not break the balloon [1].',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = await message.channel.send('Processing imgen...');
    try {
      const params = message.join(' ');
      const parts = stringUtils.getCommaSplitMessage(params);
      let base = await Jimp.read('https://raw.githubusercontent.com/fu-snail/Arcane-Vortex/master/resources/images/memes/balloon.bmp');
      let firstBalloonFont = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
      let secondBalloonFont = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
      let thirdBalloonFont = await Jimp.loadFont(Jimp.FONT_SANS_8_BLACK);

      let outputName = 'balloon.png';

      await base.print(firstBalloonFont, 80, 180, parts.first);
      await base.print(secondBalloonFont, 50, 530, parts.first);
      await base.print(thirdBalloonFont, 500, 520, parts.first);
      await base.print(firstBalloonFont, 620, 155, parts.second);

      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.Attachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <slap> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}