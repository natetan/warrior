const quotes = require('../resources/quotes.json');
const destroy = require('../resources/destroy.json');
const quoteUtils = require('../utils/quoteUtils');

module.exports = {
  name: 'dragon',
  description: 'Dragon quotes from ESO (Sunspire).',
  commandType: 'special',
  category: 'quotes',
  async execute(message, args, client) {
    try {
      let m = quoteUtils.determineQuote(message, quotes.dragon, destroy.dragon);
      return message.channel.send(m);

    } catch (err) {
      console.log(`ERROR: Command <dragon> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}