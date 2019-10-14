const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'bed',
  desc: 'Brothers are mean.',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = await message.channel.send('Processing imgen...');
    try {
      const avatars = discordUtils.getAvatars(message, client);

      let avatar1 = await Jimp.read(avatars.self);
      let avatar2 = await Jimp.read(avatars.target);
      let avatarCopy = await Jimp.read(avatars.self);
      let base = await Jimp.read('https://raw.githubusercontent.com/fu-snail/Arcane-Vortex/master/resources/images/memes/bed.bmp');
      let outputName = 'spank.png';

      avatar1.resize(100, 100);
      avatar2.resize(70, 70);
      avatarCopy.resize(70, 70);

      // const offset = 30;
      // base.crop(offset, 0, base.getWidth() - offset, base.getHeight());

      await base
        .resize(500, 500)
        .composite(avatar1, 25, 100)
        .composite(avatar1, 25, 300)
        .composite(avatarCopy, 53, 450)
        .composite(avatar2, 53, 575);

      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.Attachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <bed> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}