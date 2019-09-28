const prefix = process.env.prefix || '?';

module.exports = {
  name: 'help',
  desc: 'Not a fun way to seek help.',
  commandType: 'general',
  async execute(message, args, client) {
    try {
      await message.channel.send(`Git Gud, loser. See \`${prefix}halp\``);
    } catch (err) {
      console.log(`ERROR: Command <help> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}