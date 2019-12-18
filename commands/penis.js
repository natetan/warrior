const discordUtils = require('../utils/discordUtils');
const displayUtils = require('../utils/displayUtils');
const embedUtils = require('../utils/embedUtils');

module.exports = {
  name: 'penis',
  desc: 'Your penis size',
  usage: '[username]',
  commandType: 'general',
  async execute(message, arg, client) {
    const usernames = discordUtils.getUsernames(message);
    const target = usernames.target ? usernames.target : usernames.self;
    const size = displayUtils.getRandomIntInclusive(0, 8);
    let penis = '8';
    for (let i = 0; i < size; i++) {
      penis += '=';
    }
    penis += 'D';
    let desc = `${target} has a penis size of ${penis}`;
    let embed = embedUtils.createSimpleMessageEmbed('Penis size', desc);
    return message.channel.send(embed);
  }
}