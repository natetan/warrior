const eu = require('../utils/embedUtils');
const emojis = require('../resources/emojis');

module.exports = {
  name: 'test',
  desc: 'Testing shit goes here.',
  commandType: 'private',
  async execute(message, args, client) {
    const num = Number(args[0]);
    if (!num) {
      return message.channel.send('That is not a number');
    }
    for (let i = 0; i < num; i++) {
      message.channel.send(i + 1);
    }
    return;
  }
}