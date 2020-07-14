const esoService = require('../services/esoService');
const eu = require('../utils/embedUtils');

// Gets sets from https://eso-sets.com
module.exports = {
  name: 'set',
  desc: 'Gets a set from eso-sets.',
  args: true,
  usage: '<query>',
  commandType: 'general',
  async execute(message, args, client) {
    let query = args.join(' ');
    let m = await message.channel.send('Grabbing set from `eso-sets`...');
    let set;
    try {
      if (Number(query)) {
        set = await esoService.getSetById(query);
      } else {
        set = await esoService.getSetByName(query);
      }

      if (!set) {
        return message.channel.send('There was an error with your query.');
      }

      if (set.length < 1) {
        return message.channel.send(`Nothing found for set ${query}`);
      }

      if (set.length > 1) {
        message.channel.send(`Found more than one set for your query: ${set.length} results.`);
      }


      await message.channel.send(eu.createSetEmbed(set));
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <set> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      return message.channel.send('There was an error. I am sorry for your loss.');
    }
  }
}