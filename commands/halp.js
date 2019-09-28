const eu = require('../utils/embedUtils');

const prefix  = process.env.prefix || '?';

module.exports = {
  name: 'halp',
  desc: 'List all of my commands or info about a specific command.',
  usage: '[command name]',
  cooldown: 5,
  async execute(message, args, client) {
    const generalObj = {};
    const specialObj = {};

    const { commands } = message.client;

    const generalCommands = commands.filter((command) => {
      return command.commandType === 'general';
    });

    generalCommands.forEach((c) => {
      let obj = {};
      obj.desc = c.desc;
      obj.usage = c.usage || '';
      generalObj[c.name] = obj;
    });

    let specialCommands = commands.filter((command) => {
      return command.commandType === 'special';
    });

    let imgenCommands = [];
    let quoteCommands = [];
    let trialCommands = [];
    const specialCommandMap = {
      'imgen': imgenCommands,
      'quotes': quoteCommands,
      'trials': trialCommands
    };
    specialCommands.forEach((c) => {
      specialCommandMap[c.category].push(c.name);
    });

    specialObj['imgen'] = {
      desc: 'Image manipulation for the memes.',
      options: imgenCommands.join(', ')
    }

    specialObj['quotes'] = {
      desc: 'Quotes from ESO and other places.',
      options: quoteCommands.join(', ')
    }

    specialObj['trials'] = {
      desc: 'Manage raids. See !trial help for more info.',
      options: trialCommands.join(', ')
    }

    const mainObj = {
      general: generalObj,
      specialized: specialObj
    };

    const generalEmbed = eu.createGeneralHelpEmbed(mainObj);
    const specialEmbed = eu.createSpecializedHelpEmbed(mainObj);
    await message.channel.send(generalEmbed);
    return message.channel.send(specialEmbed);
  }
};