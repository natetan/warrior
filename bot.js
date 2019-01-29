let Discord = require('discord.js');

let translate = require('google-translate-api');
let logger = require('winston');

let auth = require('./auth.json');
let warrior = require('./resources/warrior-quotes.json');
let RaidHelper = require('./helpers/RaidHelper');
let languages = require('./translate/TranslateHelper');
let define = require('./define/define');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});

// Keeps track of the RaidEvent
var RaidEvent = undefined;

// REMOVE LATER: testing some stuff here that will be refactored later
var roster = [];

// Initialize Discord Bot
const bot = new Discord.Client();

// Logs in with the given token
bot.login(auth.token);

/**
 * The setup for when the bot launches 
 */
bot.on('ready', () => {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.user.tag);
  console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`);
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});

/**
 * This event triggers when the bot joins a guild.
 */
bot.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});

/**
 * This event triggers when the bot is removed from a guild.
 */
bot.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});

bot.on('message', async (message) => {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  const prefix = '!';

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop called 'botception'
  if (message.author.bot) {
    return;
  }

  if (!message.content.startsWith(prefix)) return;
  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();

  // Snail's first command lmao
  if (command === 'help') {
    await message.channel.send('Git Gud');
  }

  // Calculates the ping 
  if (command === 'ping') {
    const channelMessage = await message.channel.send('Ping?');
    channelMessage.edit(`Pong! Latency is ${channelMessage.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
  }

  // Tells you who you are
  if (command === 'whoami') {
    await message.channel.send(`You are ${message.author} and your username is ${message.author.username}`);
  }

  /**
   * Handles the roles of the members of the server
   * 
   * @arg all - gets all the roles and shows every user in those roles
   * @arg count - gets all the roles and the counts of how many people are in those roles
   * @arg default - gets the message sender's roles
   */
  if (command === 'roles') {
    let channel = message.channel;

    if (args[0] === 'all') {
      let results = {};
      message.guild.roles.forEach((v) => {
        let members = v.members.map((m) => {
          return m.displayName;
        });
        // Ignore the @everyone tag since that can have a lot of users
        if (v.name !== '@everyone') {
          results[v.name] = members;
        }
      });
      results = JSON.stringify(results, null, 2);
      await channel.send('```JSON' + `\n${results}\n` + '```');
    } else if (command === 'count') {
      let results = {};
      message.guild.roles.forEach((v) => {
        results[v.name] = v.members.keys.length;
      })
    } else {
      if (message.member.roles) {
        let results = {};
        message.member.roles.forEach((v, k) => {
          results[k] = v.name;
        });
        results = JSON.stringify(results, null, 2);
        await channel.send('```JSON' + `\n${results}\n` + '```');
      } else {
        await channel.send(`${message.author}, you have no roles`);
      }
    }
  }

  /**
   * THIS IS A TEST
   */
  if (command === 'react') {
    let m = await message.channel.send(`Pretend this is a roster for a run:\n ${roster.toString()}`);
    m.react('🇹');
    m.react('🇭');
    m.react('🇲');
    m.react('🇸');
    m.react('❌');
  }

  /**
   * Upon popular demand, this will randomly display a quote from the warrior
   */
  if (command === 'warrior') {
    let quotes = warrior.quotes;
    let length = quotes.length;
    let randomQuote = quotes[Math.floor(Math.random() * length)];
    message.channel.send(randomQuote);
  }

  /**
   * TODO: Raid commands that will be refactored to use emoji reactions
   * TODO: Have different roles based on the trial
   */
  if (command === 'raid') {
    // First argument
    let raidCommand = args[0];
    args.shift();
    if (raidCommand === 'create') {
      let [title, time] = args;
      let msg = 'Cannot create raid event. Required arguments: <title> <time>. Example: !raid create vMoL 730est';

      // Don't create if one exists
      if (RaidEvent !== undefined) {
        msg = `There is already an event: Raid ${RaidEvent.title} @ ${RaidEvent.time}.`
        // Only create if give a title and time
      } else if (title !== undefined || time !== undefined) {
        let newRoster = RaidHelper.createRoster();
        RaidEvent = RaidHelper.createRaid(title, time, newRoster);
        msg = RaidHelper.printRaid(RaidEvent, newRoster);
      }
      let m = await message.channel.send(msg);
      m.react('🇹');
      m.react('🇴');
      m.react('🇭');
      m.react('🇲');
      m.react('🇸');
      m.react('❌');
    } 

    if (raidCommand === 'delete') {
      let msg = 'No raid available';
      if (RaidEvent !== undefined) {
        msg = `Raid ${RaidEvent.title} @ ${RaidEvent.time} deleted`
        RaidEvent = undefined;
      }
      message.channel.send(msg);
    }
  }

  /**
   * Uses the google translate api to translate text
   * 
   * @arg targetLang - target language to translate to
   * @arg textToTranslate - text that will be translated
   */
  if (command === 'translate') {
    // syntax: command targetLang text
    let targetLang = args[0]
    if (targetLang.toLowerCase() == 'chinese') {
      targetLang = 'chinese-simplified';
    }
    args.shift();
    let textToTranslate = args.join(' ');

    translate(textToTranslate, { to: languages.getCode(targetLang) }).then(res => {
      message.channel.send(res.text);
    }).catch(err => {
      console.error(err);
    });
  }

  /**
   * Uses the Oxford dictionary API to define words
   * 
   * @arg word - the word to define
   */
  if (command === 'define') {
    let word = args[0];
    let defObject = await define.getDefinition(word);
    let definition;
    if (defObject.error) {
      definition = `Error ${defObject.error}: ${defObject.errorMessage}`;
    } else {
      definition = defObject.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0];
    }
    message.channel.send(JSON.stringify(definition, null, 2));
  }
});

/**
 * This is the event handler for when users add emoji reactions to a message.
 * The goal for this is to allow users to sign up for a roster by reacting
 */
bot.on('messageReactionAdd', async (reaction, user) => {
  // Makes sure that this event only occurs on certain messages.
  if (!reaction.message.content.includes('RaidEvent')) return;
  let player = user.username;
  if (!user.bot) {

    // check for each emoji to add either tank, healer, or dps

    // MT
    if (reaction.emoji.name === '🇹') {
      RaidEvent.roster.add(user.username, 'main');
    }

    // OT
    if (reaction.emoji.name === '🇴') {
      RaidEvent.roster.add(user.username, 'off');
    }

    // healer
    if (reaction.emoji.name === '🇭') {
      RaidEvent.roster.add(user.username, 'healer');
    }

    // dps
    if (reaction.emoji.name === '🇲' || reaction.emoji.name === '🇸') {
      RaidEvent.roster.add(user.username, 'dps');
    }

    // cancel
    if (reaction.emoji.name === '❌') {
      RaidEvent.roster.remove(user.username);
    }
    let msg = RaidHelper.printRaid(RaidEvent, RaidEvent.roster);

    // TODO: Use this in conjunction with the RaidHelper
    await reaction.message.edit(msg);
    await reaction.remove(user);
  }
});