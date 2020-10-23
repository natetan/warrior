const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'laid',
  desc: 'The kind of person who does not get laid.',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = '';
    try {
      m = await message.channel.send('Processing imgen...');
      const avatars = discordUtils.getAvatars(message, client);
      const target = await Jimp.read(avatars.target);
      const base = await Jimp.read('https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/laid.png');
      const circleMask = await Jimp.read('https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/circle-mask.png');
      const outputName = 'laid.png';

      // Put circle over image
      target.resize(115, 115);
      circleMask.resize(115 ,115);
      target.mask(circleMask, 0, 0);

      await base.composite(target, 512, 360);
      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.MessageAttachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <laid> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}