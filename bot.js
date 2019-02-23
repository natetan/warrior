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
    try {
      await message.channel.send('Git Gud');
    } catch (err) {
      console.log(`ERROR:\n\tCommand <help> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  // Calculates the ping 
  if (command === 'ping') {
    try {
      const channelMessage = await message.channel.send('Ping?');
      channelMessage.edit(`Pong! Latency is ${channelMessage.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
    } catch (err) {
      console.log(`ERROR:\n\tCommand <ping> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  /**
   * Handles the roles of the members of the server
   * 
   * @arg all - gets all the roles and shows every user in those roles
   * @arg count - gets all the roles and the counts of how many people are in those roles
   * @arg default - gets the message sender's roles
   */
  if (command === 'roles') {
    try {
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
      await channel.send(results);
    } catch (err) {
      console.log(`ERROR:\n\tCommand <roles> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  /**
   * THIS IS A TEST
   */
  if (command === 'test') {
    try {
      await message.send('test');
    } catch (err) {
      console.log('Test failed');
    }
  }

  if (command === 'cid') {
    try {
      console.log(`The ID of channel ${message.channel.name}: ${message.channel.id}`);
    } catch (err) {
      console.log(`ERROR:\n\tCommand <cid> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  // Send a message to SnF general chat
  if (command === 'troll') {
    try {
      let phrase = args.join(' ');
      let openRunsChannel = bot.channels.get(process.env.troll_channel_id || require('./auth.json').bot_test_general_channel_id);

      if (!openRunsChannel) {
        message.channel.send('Channel does not exist');
      } else {
        openRunsChannel.send(phrase);
      }
    } catch (err) {
      console.log(`ERROR:\n\tCommand <troll> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  /**
   * Upon popular demand, this will randomly display a quote from the warrior
   */

  if (command === 'warrior') {
    try {
      let warriorQuotes = quotes.warrior;
      let randomQuote = quoteHelper.getQuote(warriorQuotes);
      let warriorEmoji = bot.emojis.get(emojis.customEmojis.warrior);
      message.channel.send(`${warriorEmoji} ${randomQuote}`);
    } catch (err) {
      console.log(`ERROR:\n\tCommand <warrior> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  if (quoteHelper.quoteOptions.includes(command)) {
    try {
      let randomQuote = quoteHelper.getQuote(quotes[command]);
      message.channel.send(randomQuote);
    } catch (err) {
      console.log(`ERROR:\n\tCommand <${command}> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  /**
   * Gets the daily pledges
   */
  if (command === 'pledges') {
    try {
      let m = await message.channel.send('Grabbing pledges from esoleaderboards...');
      let dailies = await pledges.getDailies();
      m.edit(dailies);
    } catch (err) {
      console.log(`ERROR:\n\tCommand <pledges> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
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
      try {
        // Don't create if one exists
        if (RaidEvent !== undefined) {
          message.channel.send('There is already an event going on. Please delete it before creating a new one: \`!raid delete\`');
          return;
        }

        if (day === undefined || title === undefined || time === undefined) {
          message.channel.send(`I really don't think you know how to do this...TAKE A SEAT, YOUNG ${message.author}`);
          return;
        }
        if (day !== undefined && title !== undefined && time !== undefined) {
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
      } catch (err) {
        console.log(`ERROR:\n\tCommand <raid create> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      }

      try {
        await RaidMessage.react(bot.emojis.get(emojis.customEmojis.mt));
        await RaidMessage.react(bot.emojis.get(emojis.customEmojis.ot));
        await RaidMessage.react(bot.emojis.get(emojis.customEmojis.heals));
        await RaidMessage.react(bot.emojis.get(emojis.customEmojis.mag));
        await RaidMessage.react(bot.emojis.get(emojis.customEmojis.stam));
        await RaidMessage.react(emojis.examples.cancel);
      } catch (err) {
        console.error('ERROR:\n<raid create> One of the emojis failed to react.');
      }
    }
    if (raidCommand === 'delete') {
      try {
        let msg = 'No raid available';
        if (RaidEvent !== undefined) {
          msg = `Raid ${RaidEvent.title} deleted`
          RaidEvent = undefined;
          await RaidMessage.delete();
          RaidMessage = undefined;
        }
        message.channel.send(msg);
      } catch (err) {
        console.log(`ERROR:\n\tCommand <raid delete> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      }
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
    try {
      let targetLang = args[0]
      if (targetLang.toLowerCase() == 'chinese') {
        targetLang = 'chinese-simplified';
      }
      args.shift();
      let textToTranslate = args.join(' ');

      translate(textToTranslate, { to: languages.getCode(targetLang) }).then(res => {
        message.channel.send(res.text);
      }).catch(err => {
        console.error(`Translate err: ${err}`);
      });
    } catch (err) {
      console.log(`ERROR:\n\tCommand <translate> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  /**
   * Uses the Oxford dictionary API to define words
   * 
   * @arg word - the word to define
   */
  if (command === 'define') {
    try {
      let word = args[0];
      let defObject = await define.getDefinition(word);
      let definition;
      if (defObject.error) {
        definition = `Error ${defObject.error}: **${defObject.errorMessage}**`;
      } else {
        definition = defObject.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0];
      }
      message.channel.send(`*${definition}*`);
    } catch (err) {
      console.log(`ERROR:\n\tCommand <define> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  /**
   * Uses the urban dictionary API to define words
   * 
   * @arg word - the word to define
   */
  if (command === 'urban') {
    try {
      let word = args.join(' ');
      let defObject = await define.getUrbanDefinition(word);
      let definition;
      if (!defObject || defObject.error) {
        definition = `Either UrbanDictionary didn't have the term \`${word}\` or you're just looking up some strange things, my friend.`;
      } else {
        definition = defObject;
      }
      message.channel.send(`${definition}`);
    } catch (err) {
      console.log(`ERROR:\n\tCommand <urban> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
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
    let cust = emojis.customEmojis;
    try {
      // MT
      if (reaction.emoji.id === cust.mt && roster.mt.count > roster.mt.players.length && !roster.mt.players.includes(player)) {
        roster.mt.players.push(player);
        update = true;
      }

      // OT
      if (reaction.emoji.id === cust.ot && roster.ot.count > roster.ot.players.length && !roster.ot.players.includes(player)) {
        roster.ot.players.push(player);
      }

      // healer
      if (reaction.emoji.id === cust.heals && roster.healer.count > roster.healer.players.length && !roster.healer.players.includes(player)) {
        roster.healer.players.push(player);
      }

      // stam
      if (reaction.emoji.id === cust.stam && roster.stam.count > roster.stam.players.length && !roster.stam.players.includes(player)) {
        roster.stam.players.push(player);
      }

      // mag
      if (reaction.emoji.id === cust.mag && roster.mag.count > roster.mag.players.length && !roster.mag.players.includes(player)) {
        roster.mag.players.push(player);
      }

      // cancel
      if (reaction.emoji.name === '❌') {
        Object.keys(roster).forEach((role) => {
          _.remove(roster[role].players, (p) => {
            return p === player;
          });
        });
      }
    } catch (err) {
      console.log(`ERROR:\n\tEvent <messageReaction> failed.\n\tError: [${err}]`);
    }

    try {
      reaction.message.edit(EmbedCreator.createEmbed(RaidEvent.day, RaidEvent.time, RaidEvent.title, roster));
      reaction.remove(user);
    } catch (err) {
      console.log(`Error with message edit or remove: ${err}`);
    }
  }
});

