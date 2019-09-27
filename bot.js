const Discord = require('discord.js');
const logger = require('winston');
const _ = require('lodash');

const destroy = require('./resources/destroy.json');
const commands = require('./resources/commands.json');
const languages = require('./translate/TranslateHelper');
const emojis = require('./resources/emojis');
const strings = require('./resources/strings');
const firebase = require('./db/firebaseHelper');
const imgen = require('./imgen/ImageManipulator');
const quotes = require('./resources/quotes.json');
const quoteUtils = require('./utils/quoteUtils');

const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Read all the js files in /commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});


// Logs in with the given token
const token = process.env.token || require('./auth.json')['token_warrior'];
client.login(token);

/**
 * The setup for when the bot launches 
 */
client.on('ready', () => {
  logger.info('Connected');
  logger.info(`Client ID: ${client.user.id}`);
  logger.info(client.user.tag);
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

/**
 * This event triggers when the bot joins a guild.
 */
client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
  firebase.initializeGuild(guild.id, guild.name, guild.owner.displayName);
});

/**
 * This event triggers when the bot is removed from a guild.
 */
client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('guildMemberAdd', (member) => {
  let retorts = quotes.retort;
  let randomQuote = quoteHelper.getQuote(retorts);
  let welcome = `Welcome <@${member.user.id}>! ${randomQuote}`;
  member.guild.channels.find(c => c.name === "general").send(welcome);
});

client.on('guildMemberRemove', (member) => {
  let warriorQuotes = quotes.warrior;
  let randomQuote = quoteHelper.getQuote(warriorQuotes);
  let farewell = `${member.user.username} has left the guild. ${randomQuote}`;
  member.guild.channels.find(c => c.name === "general").send(farewell);
})

client.on('message', async (message) => {
  const prefix = process.env.prefix ? '!' : '?';

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop called 'botception'
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  // Whenever we set args to true in one of our command files, 
  // it'll perform this check and supply feedback if necessary.
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }
    return message.channel.send(reply);
  }

  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply('I can\'t execute that command inside DMs!');
  }

  // If someone @'s the bot, send them a nasty retort.
  if (message.isMemberMentioned(client.user) && !message.mentions.everyone) {
    let retorts = quotes.retort;
    let randomQuote = quoteUtils.getQuote(retorts);
    try {
      await message.channel.send(randomQuote);
    } catch (err) {
      console.log(`ERROR: on bot mention.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  try {
    command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply(`there was an error trying to execute that command: ${command.name}`);
  }

  // Image manipulation commands
  // const imgenCommands = ['airpods', 'egg', 'rip', 'shit', 'slap', 'vma'];

  // if (imgenCommands.includes(command)) {
  //   try {
  //     let users = message.mentions.users.map((u) => {
  //       return u;
  //     });
  //     let avatars = [];
  //     let avatar1;
  //     let avatar2;
  //     if (users.length) {
  //       avatar1 = message.author.avatarURL;
  //       avatar2 = users[0].avatarURL;
  //     } else {
  //       avatar1 = client.user.avatarURL;
  //       avatar2 = message.author.avatarURL;
  //     }
  //     avatars.push(avatar1, avatar2);
  //     imgen.determineMeme(command, avatars, message.author.username, users.length ? users[0].username : null)
  //       .then(async (imageName) => {
  //         await message.channel.send('', {
  //           file: imageName
  //         });
  //         return fs.unlinkSync(imageName);
  //       })
  //   } catch (err) {
  //     console.log(err);
  //     return message.delete();
  //   }
  // }

  /**
   * This uses quotes from other bosses if it exists.
   * 
   * options: !rakkhat, !zmaja
   */
  // if (quoteHelper.quoteOptions.includes(command)) {
  //   try {
  //     let results = message.mentions.users.map((u) => {
  //       return `<@${u.id}>`;
  //     });
  //     if (results.length > 0 && destroy[command]) {
  //       results.forEach((p) => {
  //         let randomQuote = quoteHelper.getQuote(destroy[command]);
  //         randomQuote = randomQuote.replace('@', p);
  //         return message.channel.send(`*${randomQuote}*`);
  //       });
  //     } else {
  //       let randomQuote = quoteHelper.getQuote(quotes[command]);
  //       return message.channel.send(randomQuote);
  //     }
  //   } catch (err) {
  //     console.log(`ERROR: Command <${command}> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
  //   }
  // }



});

