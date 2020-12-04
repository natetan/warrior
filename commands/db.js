const guildHelper = require('../database/guild');
const userHelper = require('../database/member');

module.exports = {
  name: 'db',
  desc: 'Google Firebase commands',
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
        const members = guild.members.cache.array();
        if (command === 'init') {
          const response = await userHelper.setUpMembers(guild, members);
          return message.channel.send(response);
        } else if (command === 'add') {
          const memberId = args.shift().substring(3).replace('>', '');
          const response = await userHelper.addMember(guild, members.find(m => m.user.id === memberId));
          return message.channel.send(response);
        } else if (command === 'remove') {
          const memberId = args.shift().substring(3).replace('>', '');
          const response = await userHelper.removeMember(guild, members.find(m => m.user.id === memberId));
          return message.channel.send(response);
        }
      } else {
        return message.channel.send(`Command ${type} not available.`)
      }
    } catch (err) {
      console.log(`Command db failed: ${err}`);
    }
  }
}