const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'lovely',
  desc: 'Tell someone that they are lovely',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = '';
    try {
      m = await message.channel.send('Processing imgen...');
      const avatars = discordUtils.getAvatars(message, client);

      const target = await Jimp.read(avatars.target);
      const self = await Jimp.read(avatars.self);
      const font32 = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
      const base = await Jimp.read('https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/note.png');
      const outputName = 'note.png';

      self.resize(100, 100);
      target.resize(110, 110);
      await base
        .composite(self, 100, 35)
        .composite(target, 415, 10)
        .print(font32, 360, 420, 'You\'re so lovely.', 150);

      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.MessageAttachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <lovely> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}