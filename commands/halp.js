const { prefix } = process.env.prefix || '?';

module.exports = {
  name: 'halp',
  description: 'List all of my commands or info about a specific command.',
  usage: '[command name]',
  cooldown: 5,
  execute(message, args) {
    const generalArray = [];
    const specialArray = [];
    const { commands } = message.client;
    let generalCommands = commands.filter((command) => {
      return command.commandType === 'general' && !command.private;
    });
    let specialCommands = commands.filter((command) => {
      return command.commandType === 'special' && !command.private;
    });
    generalArray.push(generalCommands);
    specialArray.push(specialCommands);
    console.log(generalArray);
    console.log(specialArray);
  },
};