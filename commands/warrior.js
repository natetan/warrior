const emojis = require('../resources/emojis');
const quotes = require('../resources/quotes.json');
const destroy = require('../resources/destroy.json');
const quoteUtils = require('../utils/quoteUtils');

module.exports = {
  name: 'warrior',
  desc: 'Warrior quotes from ESO.',
  commandType: 'special',
  category: 'quotes',
  async execute(message, args, client) {
    try {
      let m = quoteUtils.determineQuote(message, quotes.warrior, destroy.warrior, client.emojis.get(emojis.customEmojis.warrior));
      return message.channel.send(m);

    } catch (err) {
      console.log(`ERROR: Command <warrior> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}