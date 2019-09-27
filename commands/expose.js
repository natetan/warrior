const displayUtils = require('../utils/displayUtils');

module.exports = {
  name: 'expose',
  description: 'Find out who someone really is.',
  usage: '[username]',
  commandType: 'general',
  execute(message, args, client) {
    try {
      let user = message.author;
      if (message.mentions.users.size) {
        user = message.mentions.users.first();
      }
      return message.channel.send(`That is **${user.username}**. This person joined discord on ${displayUtils.dateToShortISO(user.createdAt)}`);
    } catch (err) {
      console.log('error in expose');
    }
  }
}