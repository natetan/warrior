module.exports = {
  name: 'help',
  description: 'Not a fun way to sseek help.',
  commandType: 'general',
  async execute(message, args, client) {
    try {
      await message.channel.send('Git Gud');
    } catch (err) {
      console.log(`ERROR: Command <help> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}