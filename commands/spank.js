const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'spank',
  desc: 'Spanks someone.',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = await message.channel.send('Processing imgen...');
    try {
      const avatars = discordUtils.getAvatars(message, client);

      let spanker = await Jimp.read(avatars.self);
      let spankee = await Jimp.read(avatars.target);
      let base = await Jimp.read('https://raw.githubusercontent.com/fu-snail/Arcane-Vortex/master/resources/images/memes/spank.bmp');
      let outputName = 'spank.png';

      spanker.resize(140, 140);
      spankee.resize(120, 120);
      await base
        .resize(500, 500)
        .composite(spanker, 225, 5)
        .composite(spankee, 350, 220);

      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.Attachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <spank> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}