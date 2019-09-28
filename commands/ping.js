module.exports = {
  name: 'ping',
  desc: 'Calculates the ping',
  commandType: 'general',
  async execute(message, args, client) {
    try {
      const channelMessage = await message.channel.send('Ping?');
      channelMessage.edit(`Pong! Latency is ${channelMessage.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    } catch (err) {
      console.log(`ERROR: Command <ping> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
};