const quotes = require('../resources/quotes.json');
const destroy = require('../resources/destroy.json');
const quoteUtils = require('../utils/quoteUtils');

module.exports = {
  name: 'ramsay',
  desc: 'Ramsay quotes.',
  commandType: 'special',
  category: 'quotes',
  async execute(message, args, client) {
    try {
      const m = quoteUtils.determineQuote(message, quotes.ramsay, destroy.ramsay);
      return message.channel.send(m);
    } catch (err) {
      console.log(`ERROR: Command <ramsay> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}