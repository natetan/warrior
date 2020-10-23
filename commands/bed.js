const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'bed',
  desc: 'Brothers are mean.',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = '';
    try {
      m = await message.channel.send('Processing imgen...');
      const avatars = discordUtils.getAvatars(message, client);

      const avatar1 = await Jimp.read(avatars.self);
      const avatar2 = await Jimp.read(avatars.target);
      const avatarCopy = await Jimp.read(avatars.self);
      const base = await Jimp.read('https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/bed.png');
      const outputName = 'spank.png';

      avatar1.resize(100, 100);
      avatar2.resize(70, 70);
      avatarCopy.resize(70, 70);

      await base
        .composite(avatar1, 25, 100)
        .composite(avatar1, 25, 300)
        .composite(avatarCopy, 53, 450)
        .composite(avatar2, 53, 575);

      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.MessageAttachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <bed> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}