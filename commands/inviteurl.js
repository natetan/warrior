module.exports = {
  name: 'inviteurl',
  desc: 'Gets the invite link for the bot and deletes the message.',
  commandType: 'private',
  execute(message, args, client) {
    console.log(`Invite link: https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot`);
    return message.delete();
  }
}