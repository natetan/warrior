const Discord = require('discord.js');
const stringUtils = require('../utils/stringUtils');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'balloon',
  desc: 'The blade [2] does not break the balloon [1].',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = await message.channel.send('Processing imgen...');
    try {
      const params = args.join(' ');
      const parts = stringUtils.getCommaSplitMessage(params);
      let base = await Jimp.read('https://raw.githubusercontent.com/fu-snail/Arcane-Vortex/master/resources/images/memes/balloon.bmp');
      let font32 = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
      let font16 = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);

      let outputName = 'balloon.png';

      await base.print(font32, 120, 150, parts.first, 162);
      await base.print(font32, 90, 500, parts.first, 170);
      await base.print(font16, 525, 520, parts.first, 110);
      await base.print(font16, 650, 155, parts.second, 125);

      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.Attachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <balloon> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}