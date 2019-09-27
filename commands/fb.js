const firebase = require('../db/firebaseHelper');

module.exports = {
  name: 'fb',
  description: 'Sets up the guild in Google Firebase.',
  args: true,
  usage: '<command>',
  commandType: 'private',
  async execute(message, args, client) {
    let fbCommand = args[0];
    if (fbCommand === 'init') {
      let guildId = message.guild.id;
      let guildName = message.guild.name;
      let guildOwner = message.guild.owner.displayName;
      await firebase.initializeGuild(guildId, guildName, guildOwner);
      return message.delete();
    } else {
      return message.send(`Command ${fbCommand} not available.`)
    }
  }
}