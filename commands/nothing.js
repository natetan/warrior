const Discord = require('discord.js');
const Jimp = require('jimp');
const displayUtils = require('../utils/displayUtils');
const discordUtils = require('../utils/discordUtils');

module.exports = {
  name: 'nothing',
  desc: 'You are nothing.',
  commandType: 'special',
  category: 'imgen',
  async execute(message, args, client) {
    let m = '';
    try {
      m = await message.channel.send('Processing imgen...');
      const base = await Jimp.read('https://raw.githubusercontent.com/natetan/warrior/master/resources/images/memes/nothing.png');
      const outputName = 'nothing.png';
      const font32 = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
      const usernames = discordUtils.getUsernames(message);
      const target = usernames.target ? usernames.target : usernames.self;

      let text = messages[displayUtils.getRandomArrayIndex(messages)];
      text = text.replace('@', target);

      await base.print(font32, 290, 5, text, 200);

      let error, res = await base.getBufferAsync(Jimp.MIME_PNG);
      const attachment = new Discord.MessageAttachment(res, outputName);
      await message.channel.send('', attachment);
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <nothing> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      await m.edit('Sorry, there was an error.');
    }
  }
}

const messages = [
  "@'s hopes and dreams",
  "@'s charming qualities",
  "@'s list of friends",
  "@'s bank account",
  "people who think @ is funny",
  "@'s achievements in life"
]