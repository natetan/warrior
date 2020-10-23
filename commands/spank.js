const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'spank',
  desc: 'Spanks someone.',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = '';
    try {
      m = await message.channel.send('Processing imgen...');
      const avatars = discordUtils.getAvatars(message, client);

      const spanker = await Jimp.read(avatars.self);
      const spankee = await Jimp.read(avatars.target);
      const base = await Jimp.read('https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/spank.png');
      const outputName = 'spank.png';

      spanker.resize(140, 140);
      spankee.resize(120, 120);

      await base
        .resize(500, 500)
        .composite(spanker, 225, 2.5)
        .composite(spankee, 370, 220);

      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.MessageAttachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <spank> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}