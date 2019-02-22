let Discord = require('discord.js');
let translate = require('google-translate-api');
let logger = require('winston');
let _ = require('lodash');

let quoteHelper = require('./quotes/QuoteHelper');
let quotes = require('./resources/eso-quotes.json');
let languages = require('./translate/TranslateHelper');
let define = require('./define/define');
let emojis = require('./resources/emojis');
let EmbedCreator = require('./raid/EmbedCreator');
let pledges = require('./pledges/PledgeHelper');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});

// Keeps track of the RaidEvent
var RaidEvent = undefined;

// Keeps track of the Raid message
var RaidMessage = undefined;

// REMOVE LATER: testing some stuff here that will be refactored later
var roster = [];

// Initialize Discord Bot
const bot = new Discord.Client();

// Logs in with the given token
const token = process.env.token || require('./auth.json').token;
bot.login(token);

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
    let results = {};
    if (args[0] === 'all') {
      message.guild.roles.forEach((v) => {
        let members = v.members.map((m) => {
          return m.displayName;
        });
        // Ignore the @everyone tag since that can have a lot of users
        if (v.name !== '@everyone') {
          results[v.name] = members;
        }
      });
      results = EmbedCreator.createRoleEmbed(results, 'ALL');
    } else if (args[0] === 'count') {
      message.guild.roles.forEach((v) => {
        results[v.name] = v.members.keyArray().length;
      });
      results = EmbedCreator.createRoleEmbed(results, 'COUNT');
    } else {
      message.member.roles.forEach((v, k) => {
        results[k] = v.name;
      });
      results = EmbedCreator.createRoleEmbed(results, message.author.username);
    }
    // results = JSON.stringify(results, null, 2);
    // await channel.send('```JSON' + `\n${results}\n` + '```');
    await channel.send(results);
  }

  /**
   * THIS IS A TEST
   */
  if (command === 'test') {
    let m = await message.channel.send(`This channel's ID is: ${message.channel.id}`);
    try {
      await m.react(bot.emojis.get(emojis.customEmojis.mt));
      await m.react(bot.emojis.get(emojis.customEmojis.ot));
      await m.react(bot.emojis.get(emojis.customEmojis.heals));
      await m.react(bot.emojis.get(emojis.customEmojis.mag));
      await m.react(bot.emojis.get(emojis.customEmojis.stam));
      await m.react(emojis.examples.cancel);
    } catch (err) {
      console.log('Test error: ' + err);
    }
  }

  /**
   * Upon popular demand, this will randomly display a quote from the warrior
   */
  
  if (command === 'warrior') {
    let warriorQuotes = quotes.warrior;
    let randomQuote = quoteHelper.getQuote(warriorQuotes);
    let warriorEmoji = bot.emojis.get(emojis.customEmojis.warrior);
    message.channel.send(`${warriorEmoji} ${randomQuote}`);
  }

  if (quoteHelper.quoteOptions.includes(command)) {
    let randomQuote = quoteHelper.getQuote(quotes[command]);
    message.channel.send(randomQuote);
  }

  /**
   * Gets the daily pledges
   */
  if (command === 'pledges') {
    let m = await message.channel.send('Grabbing pledges from esoleaderboards...');
    let dailies = await pledges.getDailies();
    m.edit(dailies);
  }

  /**
   * Raid command that handles sign-up
   */
  if (command === 'raid') {
    // First argument
    let raidCommand = args[0];
    args.shift();
    if (raidCommand === 'create') {
      let [day, time, title] = args;
      let msg = '';

      // Don't create if one exists
      if (RaidEvent !== undefined) {
        message.channel.send('There is already an event going on. Please delete it before creating a new one: \`!raid delete\`');
        return;
      } else if (day !== undefined && title !== undefined && time !== undefined) {
        RaidEvent = {
          day: day,
          time: time,
          title: title
        };
        let raid = EmbedCreator.getRaidInfo(title);
        if (raid instanceof Error) {
          message.channel.send(raid.message);
          RaidEvent = undefined;
          return;
        }
        roster = EmbedCreator.createRoster(raid);
        msg = EmbedCreator.createEmbed(day, time, title, roster);
      }
      if (msg instanceof Error) {
        await message.channel.send(msg.message);
        RaidEvent = undefined;
        return;
      }
      RaidMessage = await message.channel.send(msg);
      let examples = emojis.examples;

      try {
        await RaidMessage.react(examples.mt);
        await RaidMessage.react(examples.ot);
        await RaidMessage.react(examples.heals);
        await RaidMessage.react(examples.stam);
        await RaidMessage.react(examples.mag);
        await RaidMessage.react(examples.cancel);
      } catch (err) {
        console.error('One of the emojis failed to react.');
      }
    }

    if (raidCommand === 'delete') {
      let msg = 'No raid available';
      if (RaidEvent !== undefined) {
        msg = `Raid ${RaidEvent.title} deleted`
        RaidEvent = undefined;
        await RaidMessage.delete();
        RaidMessage = undefined;
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
      definition = `Error ${defObject.error}: **${defObject.errorMessage}**`;
    } else {
      definition = defObject.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0];
    }
    message.channel.send(`*${definition}*`);
  }

  if (command === 'urban') {
    let word = args.join(' ');
    let defObject = await define.getUrbanDefinition(word);
    let definition;
    if (defObject.error) {
      definition = `Error ${defObject.error}: **${defObject.errorMessage}**`;
    } else {
      definition = defObject;
    }
    message.channel.send(`${definition}`);
  }

});

/**
 * This is the event handler for when users add emoji reactions to a message.
 * The goal for this is to allow users to sign up for a roster by reacting
 */

bot.on('messageReactionAdd', async (reaction, user) => {
  // Makes sure that this event only occurs on certain messages.
  if (reaction.message.embeds.length <= 0 || !RaidEvent) return;
  let player = user.username;
  if (!user.bot) {

    // check for each emoji to add either tank, healer, or dps

    // MT
    if (reaction.emoji.name === '🇹' && roster.mt.count > roster.mt.players.length && !roster.mt.players.includes(player)) {
      //RaidEvent.roster.add(user.username, 'main');
      roster.mt.players.push(player);
    }

    // OT
    if (reaction.emoji.name === '🇴' && roster.ot.count > roster.ot.players.length && !roster.ot.players.includes(player)) {
      // RaidEvent.roster.add(player, 'off');
      roster.ot.players.push(player);
    }

    // healer
    if (reaction.emoji.name === '🇭' && roster.healer.count > roster.healer.players.length && !roster.healer.players.includes(player)) {
      // RaidEvent.roster.add(player, 'healer');
      roster.healer.players.push(player);
    }

    // stam
    if (reaction.emoji.name === '🇸' && roster.stam.count > roster.stam.players.length && !roster.stam.players.includes(player)) {
      // RaidEvent.roster.add(player, 'stam');
      roster.stam.players.push(player);
    }

    // mag
    if (reaction.emoji.name === '🇲' && roster.mag.count > roster.mag.players.length && !roster.mag.players.includes(player)) {
      // RaidEvent.roster.add(player, 'mag');
      roster.mag.players.push(player);
    }

    // cancel
    if (reaction.emoji.name === '❌') {
      // RaidEvent.roster.remove(player);
      Object.keys(roster).forEach((role) => {
        _.remove(roster[role].players, (p) => {
          return p === player;
        });
      });
    }

    try { 
      reaction.message.edit(EmbedCreator.createEmbed(RaidEvent.day, RaidEvent.time, RaidEvent.title, roster));
      reaction.remove(user);
    } catch (err) {
      console.log(`Error with message edit or remove: ${err}`);
    }
  }

});

