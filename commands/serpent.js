const quotes = require('../resources/quotes.json');
const destroy = require('../resources/destroy.json');
const quoteUtils = require('../utils/quoteUtils');

module.exports = {
  name: 'serpent',
  desc: 'Serpent quotes from ESO.',
  commandType: 'special',
  category: 'quotes',
  async execute(message, args, client) {
    try {
      let m = quoteUtils.determineQuote(message, quotes.serpent, destroy.serpent);
      return message.channel.send(m);

    } catch (err) {
      console.log(`ERROR: Command <serpent> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}