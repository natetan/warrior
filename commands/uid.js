module.exports = {
  name: 'uid',
  description: 'Get the user\'s ID, and then deletes the message.',
  commandType: 'private',
  async execute(message, args, client) {
    try {
      console.log(`The ID of user ${message.author.username} is ${message.author.id}`);
      await message.delete();
    } catch (err) {
      console.log(`ERROR: Command <uid> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}