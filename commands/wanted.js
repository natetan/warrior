const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'wanted',
  desc: 'You aren\'t wanted. None of us are wanted!',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = '';
    try {
      m = await message.channel.send('Processing imgen...');
      const avatars = discordUtils.getAvatars(message, client);
      const target = await Jimp.read(avatars.target);
      const base = await Jimp.read('https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/wanted.png');
      const outputName = 'wanted.png';

      target.resize(447, 447);
      
      await base.composite(target, 145, 282);
      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.MessageAttachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <wanted> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}