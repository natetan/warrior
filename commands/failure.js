const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'failure',
  desc: 'Who is a failure?',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = await message.channel.send('Processing imgen...');
    try {
      const avatars = discordUtils.getAvatars(message, client);
      const imageURL = 'https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/failure.bmp';
      let avatar = await Jimp.read(avatars.target);
      let base = await Jimp.read(imageURL);
      let outputName = 'failure.png';

      avatar.resize(215, 215);

      const offset = 30;
      base.crop(offset, 0, base.getWidth() - offset, base.getHeight());

      await base
        .composite(avatar, 143, 525);

      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.Attachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <failure> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}