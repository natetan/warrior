const eu = require('../utils/embedUtils');

const prefix  = process.env.prefix || '?';

module.exports = {
  name: 'halp',
  desc: 'List all of my commands or info about a specific command.',
  usage: '[command name]',
  cooldown: 5,
  execute(message, args, client) {
    const mainObj = {};
    const generalObj = {};
    const specialOnj = {};

    const { commands } = message.client;
    let generalCommands = commands.filter((command) => {
      return command.commandType === 'general';
    });
    generalCommands.forEach((c) => {
      let obj = {};
      obj.desc = c.desc;
      obj.usage = c.usage || '';
      generalObj[c.name] = obj;
    });
    console.log(generalObj);
    let test = Object.keys(generalObj).filter((o) => {
      return !generalObj[o].desc;
    });
    console.log(test);

    let specialCommands = commands.filter((command) => {
      return command.commandType === 'special';
    });
  },
};