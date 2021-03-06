const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'pixelate',
  desc: 'pixelates someone.',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = '';
    try {
      m = await message.channel.send('Processing imgen...');
      const avatars = discordUtils.getAvatars(message, client);

      const avatar = await Jimp.read(avatars.target);
      const outputName = 'pixelate.png';

      avatar.resize(400, 400).pixelate(15);

      let error, res = await avatar.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.MessageAttachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <pixelate> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}