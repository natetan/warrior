const quotes = require('../resources/quotes.json');
const quoteUtils = require('../utils/quoteUtils');

module.exports = {
  name: 'tigerking',
  desc: 'Tiger King documentary',
  commandType: 'special',
  category: 'quotes',
  async execute(message, args, client) {
    try {
      let m = quoteUtils.determineQuote(message, quotes.tigerking);
      return message.channel.send(m);

    } catch (err) {
      console.log(`ERROR: Command <tigerking> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}