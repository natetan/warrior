const eu = require('../utils/embedUtils');
const discordUtils = require('../utils/discordUtils');

module.exports = {
  name: 'halp',
  desc: 'List all of my commands or info about a specific command.',
  usage: '[option] - update',
  async execute(message, args, client) {
    const option = args.shift();
    const generalObj = {};
    const specialObj = {};

    const { commands } = message.client;

    const generalCommands = commands.filter((command) => {
      return command.commandType === 'general';
    });

    generalObj[this.name] = {
      desc: this.desc,
      usage: this.usage
    };
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

    const generalEmbed = eu.createGeneralHelp(mainObj);
    const specialEmbed = eu.createSpecializedHelp(mainObj);

    let channel;
    if (option && option.toLowerCase() === 'update') {
      let channelId = process.env.snf_bot_commands_channel_id || require('../auth.json').snf_bot_commands_channel_id;
      channel = client.channels.get(channelId);
      await discordUtils.deleteMessages(client, channelId, 100);
    } else {
      channel = message.channel;
    }
    
    try {
      await channel.send(generalEmbed);
      return channel.send(specialEmbed);
    } catch (err) {
      console.log(`ERROR: Command <halp> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      message.channel.send('There was an error.');
    }
  }
};