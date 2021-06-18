const eu = require('../utils/embedUtils');
const emojis = require('../resources/emojis');
const discordUtils = require('../utils/discordUtils');

const guildHelper = require('../database/guild');
const Discord = require('discord.io');

module.exports = {
  name: 'test',
  desc: 'Testing shit goes here.',
  commandType: 'private',
  async execute(message, args, client) {
    // TODO: debug bot joining something 
    let id = process.env.aerovertics_id || require('../auth.json').aerovertics_id;
    if (message.author.id === id) {
      client.emit('guildCreate', message.guild);
    }
  }
}

const spyTest = async (message, args, client) => {
    // const ids = discordUtils.getTextChannelIDs(client, '682724578874622015');
    // console.log(ids);
    // ambassadors - 744801331918667816
    const messages = await discordUtils.getMessagesFromGuildChannel(client, '519888924773187586', '744801331918667816');
    let text = '';
    messages.array().forEach(m => {
      text += `${m.author.username}: ${m.content}\n`;
    });
    message.channel.send(text);
}
