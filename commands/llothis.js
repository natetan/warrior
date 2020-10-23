const quotes = require('../resources/quotes.json');
const destroy = require('../resources/destroy.json');
const quoteUtils = require('../utils/quoteUtils');

module.exports = {
  name: 'llothis',
  desc: 'Saint Llothis the Pious quotes from ESO.',
  commandType: 'special',
  category: 'quotes',
  async execute(message, args, client) {
    try {
      const m = quoteUtils.determineQuote(message, quotes.llothis, destroy.llothis);
      return message.channel.send(m);

    } catch (err) {
      console.log(`ERROR: Command <llothis> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}