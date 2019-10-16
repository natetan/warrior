const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'fakenews',
  desc: 'Some people get fooled by the news, but not us.',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = await message.channel.send('Processing imgen...');
    try {
      const avatars = discordUtils.getAvatars(message, client);
      const imageURL = 'https://raw.githubusercontent.com/fu-snail/Arcane-Vortex/master/resources/images/memes/fakenews.bmp';
      let avatar = await Jimp.read(avatars.target);
      let base = await Jimp.read(imageURL);
      let finalBase = await Jimp.read(imageURL);
      let outputName = 'fakenews.png';

      avatar.resize(400, 400);

      // const offset = 30;
      // base.crop(offset, 0, base.getWidth() - offset, base.getHeight());

      // await base
      //   .resize(500, 500)
      //   .composite(avatar, 370, 220);
      await finalBase
        .composite(avatar, 390, 0)
        .composite(base, 0, 0);

      let error, res = await finalBase.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.Attachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <fakenews> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}