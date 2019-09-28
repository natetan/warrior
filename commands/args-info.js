/**
 * This is used as an example for handling special arguments
 */
module.exports = {
  name: 'args-info',
  desc: 'Information about the arguments provided.',
  args: true,
  usage: '<user> <role>',
  guildOnly: true,
  cooldown: 5,
  commandType: 'general',
  execute(message, args) {
    if (args[0] === 'foo') {
      return message.channel.send('bar');
    }
    message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
  },
};