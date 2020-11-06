const eu = require('../utils/embedUtils');
const emojis = require('../resources/emojis');

module.exports = {
  name: 'test',
  desc: 'Testing shit goes here.',
  commandType: 'private',
  async execute(message, args, client) {
    client.emit('guildMemberAdd', message.member);
  }
}