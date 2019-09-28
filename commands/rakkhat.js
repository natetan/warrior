const quotes = require('../resources/quotes.json');
const destroy = require('../resources/destroy.json');
const quoteUtils = require('../utils/quoteUtils');

module.exports = {
  name: 'rakkhat',
  desc: 'Rakkhat quotes from ESO.',
  commandType: 'special',
  category: 'quotes',
  async execute(message, args, client) {
    try {
      let m = quoteUtils.determineQuote(message, quotes.rakkhat, destroy.rakkhat);
      return message.channel.send(m);

    } catch (err) {
      console.log(`ERROR: Command <rakkhat> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}