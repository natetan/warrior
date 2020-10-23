const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'shit',
  desc: 'You stepped in some shit.',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = '';
    try {
      m = await message.channel.send('Processing imgen...');
      const avatars = discordUtils.getAvatars(message, client);

      const shit1 = await Jimp.read(avatars.target);
      const shit2 = await Jimp.read(avatars.target);
      const shit3 = await Jimp.read(avatars.target);
      const base = await Jimp.read('https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/shit.png');
      const outputName = 'shit.png';

      shit1.resize(80, 80);
      shit2.resize(80, 80);
      shit3.resize(80, 80);

      await base
        .composite(shit1, 225, 820)
        .composite(shit2, 305, 720)
        .composite(shit3, 385, 620)

      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.MessageAttachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <slap> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}