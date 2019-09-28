const esoService = require('../services/esoService');
const eu = require('../utils/embedUtils');

module.exports = {
  name: 'pledges',
  desc: 'Gets the daily pledges.',
  commandType: 'general',
  async execute(message, args, client) {
    try {
      let m = await message.channel.send('Grabbing pledges from Dwemer Automaton...');
      let dailies = await esoService.getPledges();
      let embed = eu.createPledgesEmbed(dailies);
      return m.edit(embed);
    } catch (err) {
      console.log(`ERROR: Command <pledges> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}