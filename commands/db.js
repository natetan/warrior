const guildHelper = require('../database/guild');
const userHelper = require('../database/member');

module.exports = {
  name: 'db',
  desc: 'Sets up the guild in Google Firebase.',
  args: true,
  usage: '<command>',
  commandType: 'private',
  async execute(message, args, client) {
    try {
      const guild = message.guild;
      const type = args.shift();
      if (type === 'guild') {
        const command = args.shift();
        if (command === 'init') {
          const guildName = guild.name;
          const guildOwner = guild.owner.user;
          await guildHelper.create(guild, guildName, guildOwner);
          return message.delete();
        }
      } else if (type === 'member') {
        const command = args.shift();
        if (command === 'init') {
          const members = guild.members.cache.array();
          await userHelper.setUpMembers(guild, members);
          return message.delete();
        }
      } else {
        return message.send(`Command ${type} not available.`)
      }
    } catch (err) {
      console.log(`Command db failed: ${err}`);
    }
  }
}