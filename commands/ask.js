const displayUtils = require('../utils/displayUtils');
const quotes = require('../resources/quotes.json');

module.exports = {
  name: 'ask',
  desc: 'Ask and you shall receive',
  usage: '<question>',
  args: true,
  commandType: 'general',
  async execute(message, arg, client, logger) {
    try {
      let answers = quotes.answers;
      let index = displayUtils.getRandomArrayIndex(answers);
      let res = answers[index];
      await message.channel.send(res);
    } catch (err) {
      logger.error({
        user: message.author.username,
        content: message.content,
        error: err
      });
    }
  }
}