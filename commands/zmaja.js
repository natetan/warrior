const quotes = require('../resources/quotes.json');
const destroy = require('../resources/destroy.json');
const quoteUtils = require('../utils/quoteUtils');

module.exports = {
  name: 'zmaja',
  desc: 'Z\'Maja quotes from ESO.',
  commandType: 'special',
  category: 'quotes',
  async execute(message, args, client) {
    try {
      let m = quoteUtils.determineQuote(message, quotes.zmaja, destroy.zmaja);
      return message.channel.send(m);

    } catch (err) {
      console.log(`ERROR: Command <zmaja> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}