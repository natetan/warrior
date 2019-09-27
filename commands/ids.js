module.exports = {
  name: 'ids',
  description: 'Logs out all the members and their ids in the channel and deletes the message.',
  commandType: 'private',
  async execute(message, args, client) {
    try {
      let res = {};
      message.channel.members.forEach((member) => {
        res[member.user.username] = member.user.id
      });
      console.log(res);
      await message.delete();
    } catch (err) {
      console.log(`ERROR: Command <ids> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}