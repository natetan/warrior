const eu = require('../utils/embedUtils');

module.exports = {
  name: 'roles',
  description: 'Show roles for yourself, or get an aggregate.',
  usage: '[option] - all, count',
  commandType: 'general',
  async execute(message, args, client) {
    try {
      let channel = message.channel;
      let results = {};
      if (args[0] === 'all') {
        message.guild.roles.forEach((v) => {
          let members = v.members.map((m) => {
            return m.displayName;
          });
          // Ignore the @everyone tag since that can have a lot of users
          if (v.name !== '@everyone') {
            results[v.name] = members;
          }
        });
        results = eu.createRoleEmbed(results, 'ALL');
      } else if (args[0] === 'count') {
        message.guild.roles.forEach((v) => {
          results[v.name] = v.members.keyArray().length;
        });
        results = eu.createRoleEmbed(results, 'COUNT');
      } else {
        message.member.roles.forEach((v, k) => {
          results[k] = v.name;
        });
        results = eu.createRoleEmbed(results, message.author.username);
      }
      await channel.send(results);
    } catch (err) {
      console.log(`ERROR: Command <roles> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}