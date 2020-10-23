const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'vma',
  desc: 'Someone does not know how to run vMA effectively.',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = '';
    try {
      m = await message.channel.send('Processing imgen...');
      const usernames = discordUtils.getUsernames(message);
      const name = usernames.target ? usernames.target : usernames.self;
      const base = await Jimp.read('https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/low-vma.png');
      const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
      const outputName = 'vma.png';

      await base.print(font, 576, 475, name)

      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.MessageAttachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <vma> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}