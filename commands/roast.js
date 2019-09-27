const quotes = require('../resources/quotes.json');
const quoteUtils = require('../utils/quoteUtils');

module.exports = {
  name: 'roast',
  description: 'Get toasted!',
  usage: '[username]',
  commandType: 'general',
  async execute(message, arg, client) {
    let retorts = quotes.retort;
    let randomQuote = quoteUtils.getQuote(retorts);
    try {
      await message.channel.send(randomQuote);
    } catch (err) {
      console.log(`ERROR: on roast.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}