const Discord = require('discord.js');
const discordUtils = require('../utils/discordUtils');
const Jimp = require('jimp');

module.exports = {
  name: 'screams',
  desc: 'WHY CAN\'T YOU JUST BE NORMAL',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = await message.channel.send('Processing imgen...');
    try {
      const avatars = discordUtils.getAvatars(message, client);

      let normalPerson = await Jimp.read(avatars.self);
      let screamer = await Jimp.read(avatars.target);
      let base = await Jimp.read('https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/screams.png');
      let outputName = 'screams.png';

      normalPerson.resize(175, 175);
      screamer.resize(156, 156);

      await base
        .composite(normalPerson, 200, 1)
        .composite(screamer, 136, 231);

      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.Attachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <screams> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}