const ds = require('../services/definitionService');
const eu = require('../utils/embedUtils');

module.exports = {
  name: 'define',
  desc: 'Defines a given word.',
  usage: '<query>',
  args: true,
  commandType: 'general',
  async execute(message, args, client) {
    try {
      const word = args.join(' ');
      const term = await ds.getDefinition(word);
      if (term.error) {
        return message.channel.send(term.errorMessage);
      }

      const embed = eu.createDefinition(term);
      return message.channel.send(embed);
    } catch (err) {
      console.log(`ERROR: Command <define> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}