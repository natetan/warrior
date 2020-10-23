const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'cute',
  desc: 'Someone is looking cute',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = '';
    try {
      m = await message.channel.send('Processing imgen...');
      const avatars = discordUtils.getAvatars(message, client);
      const person = await Jimp.read(avatars.target);
      const base = await Jimp.read('https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/cute.png');
      const outputName = 'cute.png';

      person.resize(500, 500);
      await base.composite(person, 675, 220);
      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.MessageAttachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <cute> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}