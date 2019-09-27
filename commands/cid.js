module.exports = {
  name: 'cid',
  description: 'Logs the channel\'s name and ID, and then deletes the message.',
  args: false,
  private: true,
  commandType: 'general',
  async execute(message, args) {
    try {
      console.log(`The ID of channel #${message.channel.name} in guild <${message.guild.name}>: ${message.channel.id}`);
      let allChannels = message.guild.channels.sort((a, b) => {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      }).filter((c) => {
        return c.type === 'text';
      }).map((c) => {
        return {
          name: c.name,
          id: c.id
        };
      });
      console.log(allChannels);
      await message.delete();
    } catch (err) {
      console.log(`ERROR: Command <cid> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
}