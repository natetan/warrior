module.exports = {
  name: 'ping',
  description: 'Calculates the ping',
  execute(message, args) {
    try {
      const channelMessage = await message.channel.send('Ping?');
      channelMessage.edit(`Pong! Latency is ${channelMessage.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
    } catch (err) {
      console.log(`ERROR: Command <ping> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
};