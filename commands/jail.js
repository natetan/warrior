const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'jail',
  desc: 'Them them to jail!',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = '';
    try {
      m = await message.channel.send('Processing imgen...');
      const avatars = discordUtils.getAvatars(message, client);
      const imageURL = 'https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/jail.png';
      const avatar = await Jimp.read(avatars.target);
      const base = await Jimp.read(imageURL);
      const outputName = 'jail.png';

      avatar.resize(350, 350);
      base.resize(350, 350).rgba(true);

      await avatar
        .composite(base, 0, 0, {
          mode: Jimp.BLEND_SOURCE_OVER,
          opacityDest: 1,
          opacitySource: 1
        }).grayscale();

      let error, res = await avatar.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.MessageAttachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <jail> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}