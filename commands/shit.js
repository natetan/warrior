const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'shit',
  desc: 'You stepped in some shit.',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = await message.channel.send('Processing imgen...');
    try {
      const avatars = discordUtils.getAvatars(message, client);

      let shit1 = await Jimp.read(avatars.target);
      let shit2 = await Jimp.read(avatars.target);
      let shit3 = await Jimp.read(avatars.target);
      let base = await Jimp.read('https://raw.githubusercontent.com/fu-snail/Arcane-Vortex/master/resources/images/memes/shit.bmp');
      let outputName = 'shit.png';

      shit1.resize(80, 80);
      shit2.resize(80, 80);
      shit3.resize(80, 80);

      await base
        .composite(shit1, 225, 820)
        .composite(shit2, 305, 720)
        .composite(shit3, 385, 620)

      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.Attachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <slap> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}