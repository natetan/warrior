const permissions= require('../constants/permissions')

module.exports = {
  name: 'purge',
  desc: 'Purges between 1 to 20 messages. Admins only.',
  args: true,
  usage: '<number>',
  commandType: 'general',
  async execute(message, args, client) {
    // Checks if the user is in a role that has permission
    // So far, roles include: Admin
    let hasPermission = message.member.roles.some(r => permissions.adminRoles.includes(r.name));
    if (!hasPermission) {
      return message.channel.send(`${message.author}, you do not have permission to use this command`);
    }
    const deleteCount = Number(args[0]);
    if (!deleteCount) {
      return message.channel.send('That\'s not even a fucking number, you expired milk carton.');
    }
    let min = 1;
    let max = 20;
    if (!deleteCount || deleteCount <= min || deleteCount > max) {
      return message.reply(`Please provide a number between ${min} (exclusive) and ${max} (inclusive) for the number of messages to delete.`);
    }
    try {
      const recentMessages = await message.channel.fetchMessages({ limit: deleteCount });
      message.channel.bulkDelete(recentMessages).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    } catch (err) {
      console.log(`ERROR: Command <purge> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}