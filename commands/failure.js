const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'failure',
  desc: 'Who is a failure?',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = '';
    try {
      m = await message.channel.send('Processing imgen...');
      const avatars = discordUtils.getAvatars(message, client);
      const imageURL = 'https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/failure.png';
      const avatar = await Jimp.read(avatars.target);
      const base = await Jimp.read(imageURL);
      const outputName = 'failure.png';

      avatar.resize(215, 215);

      await base
        .composite(avatar, 143, 525);

      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.MessageAttachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <failure> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}