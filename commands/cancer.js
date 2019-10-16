const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'cancer',
  desc: 'Who is cancerous af?',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = await message.channel.send('Processing imgen...');
    try {
      const avatars = discordUtils.getAvatars(message, client);
      const imageURL = 'https://raw.githubusercontent.com/fu-snail/Arcane-Vortex/master/resources/images/memes/cancer.bmp';
      let avatar = await Jimp.read(avatars.target);
      let base = await Jimp.read(imageURL);
      let outputName = 'cancer.png';

      avatar.resize(100, 100);

      const offset = 30;
      base.crop(offset, 0, base.getWidth() - offset, base.getHeight());

      await base
        .composite(avatar, 351, 200);

      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.Attachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <cancer> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}