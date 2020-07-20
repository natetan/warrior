const esoService = require('../services/esoService');
const eu = require('../utils/embedUtils');

// Gets skills from https://eso-skillbook.com
module.exports = {
  name: 'skill',
  desc: 'Gets a skill from eso-skillbook.',
  args: true,
  usage: '<query>',
  commandType: 'general',
  async execute(message, args, client) {
    let query = args.join(' ');
    let m = await message.channel.send('Grabbing set from `eso-skillbook`...');
    let skill;
    try {
      if (Number(query)) {
        skill = await esoService.getSkillById(query);
      } else {
        skill = await esoService.getSkillByName(query);
      }

      if (!skill) {
        message.channel.send('There was an error with your query.');
        return m.delete();
      }

      if (skill.length < 1) {
        message.channel.send(`Nothing found for skill ${query}`);
        return m.delete();
      }

      if (skill.length > 1) {
        message.channel.send(`Found more than one skill for your query: ${skill.length} results.`);
      }

      message.channel.send(eu.createSkillEmbed(skill));
      return m.delete();
    } catch (err) {
      console.log(`ERROR: Command <skill> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      message.channel.send('There was an error. I am sorry for your loss.');
      return m.delete();
    }
  }
}