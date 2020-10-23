const quotes = require('../resources/quotes.json');
const quoteUtils = require('../utils/quoteUtils');

module.exports = {
  name: 'roast',
  desc: 'Get toasted!',
  usage: '[username]',
  commandType: 'general',
  async execute(message, arg, client) {
    const retorts = quotes.retort;
    const randomQuote = quoteUtils.getQuote(retorts);
    try {
      await message.channel.send(randomQuote);
    } catch (err) {
      console.log(`ERROR: on roast.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}