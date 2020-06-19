const discordUtils = require('../utils/discordUtils');

module.exports = {
  name: 'purge',
  desc: 'Purges between 1 to 20 messages. Admins only.',
  args: true,
  usage: '<number>',
  commandType: 'general',
  async execute(message, args, client) {

    // Checks if the user is in a role that has permission
    let hasPermission = message.member.hasPermission('MANAGE_MESSAGES');
    if (!hasPermission) {
      return message.channel.send(`${message.author}, you do not have permission to use this command`);
    }
    const deleteCount = Number(args[0]);
    if (!deleteCount) {
      return message.channel.send('That\'s not even a fucking number, you expired milk carton.');
    }
    let min = 0;
    let max = 20;
    if (!deleteCount || deleteCount <= min || deleteCount > max) {
      return message.reply(`Please provide a number between ${min} and ${max} for the number of messages to delete.`);
    }
    try {
      await discordUtils.deleteMessages(client, message.channel.id, deleteCount);
    } catch (err) {
      console.log(`ERROR: Command <purge> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}