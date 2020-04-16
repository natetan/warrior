const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'wanted',
  desc: 'You\'re not wanted. None of us are wanted!',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = await message.channel.send('Processing imgen...');
    try {
      const avatars = discordUtils.getAvatars(message, client);
      let target = await Jimp.read(avatars.target);
      let base = await Jimp.read('https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/wanted.png');
      let outputName = 'wanted.png';

      target.resize(447, 447);
      const offset = 30;
      base.crop(offset, 0, base.getWidth() - offset, base.getHeight());
      await base.composite(target, 145, 282);
      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.Attachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <wanted> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}