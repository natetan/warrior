const quotes = require('../resources/quotes.json');
const destroy = require('../resources/destroy.json');
const quoteUtils = require('../utils/quoteUtils');

module.exports = {
  name: 'olms',
  desc: 'Saint Olms the Just quotes from ESO.',
  commandType: 'special',
  category: 'quotes',
  async execute(message, args, client) {
    try {
      const m = quoteUtils.determineQuote(message, quotes.olms, destroy.olms);
      return message.channel.send(m);

    } catch (err) {
      console.log(`ERROR: Command <olms> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}