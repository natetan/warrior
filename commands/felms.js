const quotes = require('../resources/quotes.json');
const destroy = require('../resources/destroy.json');
const quoteUtils = require('../utils/quoteUtils');

module.exports = {
  name: 'felms',
  desc: 'Saint Felms the Bold quotes from ESO.',
  commandType: 'special',
  category: 'quotes',
  async execute(message, args, client) {
    try {
      const m = quoteUtils.determineQuote(message, quotes.felms, destroy.felms);
      return message.channel.send(m);

    } catch (err) {
      console.log(`ERROR: Command <felms> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}