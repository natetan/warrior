module.exports = {
  name: 'troll',
  desc: 'Sends a message to SnF general chat.',
  commandType: 'private',
  async execute(message, args, client) {
    try {
      let phrase = args.join(' ');
      let channel = client.channels.cache.get(process.env.troll_channel_id || require('../auth.json').bot_test_general_channel_id);

      if (!channel) {
        return message.channel.send('Channel does not exist');
      } else {
        return channel.send(phrase);
      }
    } catch (err) {
      console.log(`ERROR: Command <troll> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}