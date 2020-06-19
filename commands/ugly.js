const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'ugly',
  desc: 'I can\'t stand the sight of you.',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = await message.channel.send('Processing imgen...');
    try {
      const avatars = discordUtils.getAvatars(message, client);
      let target = await Jimp.read(avatars.target);
      let base = await Jimp.read('https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/ugly.png');
      let outputName = 'ugly.png';

      target.resize(175, 175);
      
      await base.composite(target, 120, 55);
      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.Attachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <ugly> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}