let Discord = require('discord.js');
let logger = require('winston');
let _ = require('lodash');
let fs = require('fs');

let quoteHelper = require('./quotes/QuoteHelper');
let quotes = require('./resources/quotes.json');
let destroy = require('./resources/destroy.json');
let languages = require('./translate/TranslateHelper');
let define = require('./define/define');
let emojis = require('./resources/emojis');
let EmbedCreator = require('./raid/EmbedCreator');
let strings = require('./resources/strings');
let firebase = require('./db/FirebaseHelper');
let sets = require('./sets/EsoSets');
let skills = require('./skills/EsoSkills');
let pledges = require('./pledges/EsoPledges');
let doggo = require('./doggo/Doggo');
let memes = require('./memes/Memes');
let imgen = require('./imgen/ImageManipulator');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});

// Important roles that have permission
const permissionRoles = ['Admin', 'bot', 'Core'];

// Image manipulation commands
const imgenCommands = ['airpods', 'egg', 'rip', 'shit', 'slap'];

// Initialize Discord Bot
const bot = new Discord.Client();

// Logs in with the given token
const token = process.env.token || require('./auth.json')['token_warrior'];
bot.login(token);

/**
 * The setup for when the bot launches 
 */
bot.on('ready', () => {
  logger.info('Connected');
  logger.info(`Client ID: ${bot.user.id}`);
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
  firebase.initializeGuild(guild.id, guild.name, guild.owner.displayName);
});

/**
 * This event triggers when the bot is removed from a guild.
 */
bot.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
});

bot.on('guildMemberAdd', (member) => {
  let retorts = quotes.retort;
  let randomQuote = quoteHelper.getQuote(retorts);
  let welcome = `Welcome <@${member.user.id}>! ${randomQuote}`;
  member.guild.channels.find(c => c.name === "general").send(welcome);
});

bot.on('guildMemberRemove', (member) => {
  let warriorQuotes = quotes.warrior;
  let randomQuote = quoteHelper.getQuote(warriorQuotes);
  let farewell = `${member.user.username} has left the guild. ${randomQuote}`;
  member.guild.channels.find(c => c.name === "general").send(farewell);
})

bot.on('message', async (message) => {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  const prefix = process.env.prefix ? '!' : '?';

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop called 'botception'
  if (message.author.bot) {
    return;
  }

  if (message.isMemberMentioned(bot.user) && !message.mentions.everyone) {
    let retorts = quotes.retort;
    let randomQuote = quoteHelper.getQuote(retorts);
    try {
      await message.channel.send(randomQuote);
    } catch (err) {
      console.log(`ERROR: on bot mention.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  if (!message.content.startsWith(prefix)) return;
  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();

  /**
   * Logs the channel's name and ID, and then deletes the message.
   */
  if (command === 'cid') {
    try {
      console.log(`The ID of channel #${message.channel.name} in guild <${message.guild.name}>: ${message.channel.id}`);
      await message.delete();
    } catch (err) {
      console.log(`ERROR: Command <cid> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  if (command === 'doggo') {
    try {
      let doggoUrl = await doggo.getRandomDoggo();
      message.channel.send(doggoUrl.url);
    } catch (err) {
      console.log(`ERROR: Command <doggo> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      message.channel.send('There was an error. No doggos for you.');
    }
  }

  /**
   * Get the user's ID, and then deletes the message
   */
  if (command === 'uid') {
    try {
      console.log(`The ID of user ${message.author.username} is ${message.author.id}`);
      await message.delete();
    } catch (err) {
      console.log(`ERROR: Command <uid> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  // Logs out all the members and their ids in the channel and deletes the message
  if (command === 'ids') {
    try {
      let res = {};
      message.channel.members.forEach((member) => {
        res[member.user.username] = member.user.id
      });
      console.log(res);
      await message.delete();
    } catch (err) {
      console.log(`ERROR: Command <ids> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
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
      console.log(`ERROR: Command <define> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  // Firebase stuff
  if (command === 'fb') {
    let fbCommand = args[0];
    if (!fbCommand) {
      return await message.channel.send(`Command !fb requires parameters: !fb <command>`);
    }
    if (fbCommand === 'init') {
      let guildId = message.guild.id;
      let guildName = message.guild.name;
      let guildOwner = message.guild.owner.displayName;
      await firebase.initializeGuild(guildId, guildName, guildOwner);
      return message.delete();
    }
  }

  /**GAMBLING GAME */
  if (command === 'game') {
    let gameCommand = args[0];
    if (!gameCommand) {
      return await message.channel.send(`Command !game requires parameters: !game <command>`);
    }
    let guildId = message.guild.id;
    if (gameCommand === 'setup') {
      let hasPermission = message.member.roles.some(r => permissionRoles.includes(r.name));
      if (!hasPermission) {
        return message.channel.send(`${message.author}, you do not have permission to use this command`);
      }
      try {
        args.shift();
        let amount = args[0];
        let members = message.guild.members;
        let players = [];
        let startingAmount = Number(amount) || 200000;
        members.forEach((m) => {
          let member = {
            name: m.user.username,
            funds: startingAmount
          };
          players.push(member)
        });
        let errorNames = await firebase.setUpPlayers(guildId, players);
        if (errorNames.length === 0) {
          message.channel.send(`Setup complete! All players in this server have been setup with $${startingAmount}`);
        } else {
          message.channel.send(`Setup complete! However, here are the players that could not be added: \`${errorNames.toString()}\` because their names contained: \`.\`, \`#\`, \`$\`, \`[\`, or \`]\``);
        }
      } catch (err) {
        console.log(`ERROR: Command <${command}> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      }
    } else if (gameCommand === 'funds') {
      let userExists = await firebase.userExists(guildId, message.author.username);
      if (!userExists) {
        return message.channel.send('You do not exist in the database. I cannot retrieve your funds. I\'d add you in, but that\'s against protocol. Try `!help`.');
      }
      let funds = await firebase.getPlayerFunds(guildId, message.author.username);
      let msg = `${message.author}, you have $${funds}`;
      if (!funds && funds > 0) {
        msg = `Sorry, ${message.author} I could not retrieve your funds. Either there was an error on my end, or you're just a bum.`;
      }
      message.channel.send(msg);
    } else if (gameCommand === 'give') {
      let userExists = await firebase.userExists(guildId, message.author.username);
      if (!userExists) {
        return message.channel.send('You do not exist in the database. I cannot retrieve your funds. I\'d add you in, but that\'s against protocol. Try `!help`.');
      }
      args.shift();
      let receiver = args[0];
      // Receiver looks like this: <@123456789>
      receiver = receiver.replace(/\</g, '').replace(/\>/g, '').replace(/@/g, '');
      let user;

      // We'll try to parse a user from an @, and if that fails, use what they typed
      // i.e. @Aerovertics vs aerovertics
      try {
        user = await bot.fetchUser(receiver);
      } catch (err) {
        console.log(`SUPPRESSING ERROR: ${err}. Attempting to use actual string.`);
        user = receiver;
      }

      let receiverName = user.username || user;
      let receiverExists = await firebase.userExists(guildId, receiverName);
      if (!receiverExists) {
        return message.channel.send(`${receiverName} does not exist in the database.`);
      }

      args.shift();
      let amount = args[0];

      if (!amount) {
        return message.channel.send(`${message.author}, you must input an amount to give.`);
      }

      if (!Number(amount)) {
        return message.channel.send(`${message.author}, that's not an integer I can parse, you vitamin-d deficient clown.`);
      }

      amount = Math.floor(amount);

      if (amount < 1) {
        return message.channel.send(`${message.author}, you must give an amount greater than 0 you frugally poor dweeb.`);
      }

      let senderFunds = await firebase.getPlayerFunds(guildId, message.author.username);
      if (amount > senderFunds) {
        return message.channel.send(`${message.author}, you can't send more than you have. Balance: $${senderFunds}`);
      }

      receiverFunds = await firebase.updatePlayerFunds(guildId, receiverName, amount);
      senderFunds = await firebase.updatePlayerFunds(guildId, message.author.username, amount * -1);
      return message.channel.send(`Transfer complete!\n\t${message.author.username}: $${senderFunds}\n\t${receiverName}: $${receiverFunds}`);
    } else {
      return await message.channel.send(`!game ${gameCommand} is not valid.`);
    }
  }

  // The actual help command. Deletes after a minute.
  if (command === 'halp') {
    try {
      let helpMessage = 'You\'ve reached ZOS Customer Support! Here are your available game-breaking commands:\n';
      let helpStrings = Object.keys(strings.commands);
      helpStrings.forEach((c) => {
        helpMessage += `${c}: ${strings.commands[c]}\n\n`;
      });
      let m = await message.channel.send(helpMessage);
      setTimeout(async () => {
        await message.delete();
        await m.delete();
      }, 60000);
    } catch (err) {
      console.log(`ERROR: Command <halp> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  // Snail's first command lmao
  if (command === 'help') {
    try {
      await message.channel.send('Git Gud');
    } catch (err) {
      console.log(`ERROR: Command <help> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  if (command === 'inviteurl') {
    console.log(`Invite link: https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&permissions=0&scope=bot`);
    return message.delete();
  }

  if (command === 'meme') {
    let m = await message.channel.send('Fetching random meme from reddit...');
    try {
      let meme = await memes.getRandomMeme();
      return m.edit(`From \`r/${meme.subreddit}\`: ${meme.url}`);
    } catch (err) {
      return m.edit(`There was an error: ${err}`);
    }
  }

  // Calculates the ping 
  if (command === 'ping') {
    try {
      const channelMessage = await message.channel.send('Ping?');
      channelMessage.edit(`Pong! Latency is ${channelMessage.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
    } catch (err) {
      console.log(`ERROR: Command <ping> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  /**
   * Gets the daily pledges
   */
  if (command === 'pledges') {
    try {
      let m = await message.channel.send('Grabbing pledges from Dwemer Automaton...');
      let dailies = await pledges.getPledges();
      let embed = EmbedCreator.createPledgesEmbed(dailies);
      m.edit(embed);
    } catch (err) {
      console.log(`ERROR: Command <pledges> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  // Purge
  if (command === 'purge') {
    // Checks if the user is in a role that has permission
    // So far, roles include: Admin
    let hasPermission = message.member.roles.some(r => permissionRoles.includes(r.name));
    if (!hasPermission) {
      return message.channel.send(`${message.author}, you do not have permission to use this command`);
    }
    const deleteCount = Number(args[0]);
    let min = 1;
    let max = 20;
    if (!deleteCount || deleteCount <= min || deleteCount > max) {
      return message.reply(`Please provide a number between ${min} (exclusive) and ${max} (inclusive) for the number of messages to delete.`);
    }
    try {
      const recentMessages = await message.channel.fetchMessages({ limit: deleteCount });
      message.channel.bulkDelete(recentMessages).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    } catch (err) {
      console.log(`ERROR: Command <purge> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  /**
   * Raid command that handles sign-up (CURRENTLY ON HOLD)
   */
  if (command === 'raidllllllllll') {
    // First argument
    let raidCommand = args[0];
    args.shift();
    if (raidCommand === 'create') {
      let [day, time, title] = args;
      let msg = '';
      try {
        // Don't create if one exists
        if (RaidEvent !== undefined) {
          return message.channel.send('There is already an event going on. Please delete it before creating a new one: \`!raid delete\`');
        }

        if (day === undefined || title === undefined || time === undefined) {
          return message.channel.send(`I really don't think you know how to do this...TAKE A SEAT, YOUNG ${message.author}`);
        }
        if (day !== undefined && title !== undefined && time !== undefined) {
          RaidEvent = {
            day: day,
            time: time,
            title: title
          };
          let raid = EmbedCreator.getRaidInfo(title);
          if (raid instanceof Error) {
            RaidEvent = undefined;
            return message.channel.send(raid.message);
          }
          roster = EmbedCreator.createRoster(raid);
          msg = EmbedCreator.createEmbed(day, time, title, roster);
        }
        if (msg instanceof Error) {
          RaidEvent = undefined;
          return await message.channel.send(msg.message);
        }
        RaidMessage = await message.channel.send(msg);
      } catch (err) {
        console.log(`ERROR: Command <raid create> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
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
        console.log(`ERROR: Command <raid delete> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      }
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
      console.log(`ERROR: Command <roles> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  /**
   * Gets sets from https://eso-sets.com
   * 
   * Users can either look for an item string or its ID.
   * 
   * @arg query - name of item or id of item
   */
  if (command === 'set') {
    let query = args.join(' ');
    if (!query) {
      return message.channel.send('Command `!set` requires arguments: `!set <name>` or `!set <id>`.');
    }
    let m = await message.channel.send('Grabbing set from `eso-sets`...');
    let set;
    if (Number(query)) {
      set = await sets.GetSetById(query);
    } else {
      set = await sets.GetSetByName(query);
    }

    if (!set) {
      return m.edit('There was an error with your query.');
    }

    if (set.length < 1) {
      return m.edit(`Nothing found for set ${query}`);
    }

    if (set.length > 1) {
      message.channel.send(`Found more than one set for your query: ${set.length} results.`);
    }

    try {
      return m.edit(EmbedCreator.createSetEmbed(set))
    } catch (err) {
      console.log(`ERROR: Command <set> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      return m.edit('There was an error. I am sorry for your loss.');
    }
  }

  /**
   * Gets skills from https://eso-skillbook.com
   * 
   * Users can either look for an item string or its ID.
   * 
   * @arg query - name of item or id of item
   */
  if (command === 'skill') {
    let query = args.join(' ');
    if (!query) {
      return message.channel.send('Command `!skill` requires arguments: `!skill <name>` or `!skill <id>`.');
    }
    let m = await message.channel.send('Grabbing set from `eso-skillbook`...');
    let skill;
    if (Number(query)) {
      skill = await skills.GetSkillById(query);
    } else {
      skill = await skills.GetSkillByName(query);
    }

    if (!skill) {
      return m.edit('There was an error with your query.');
    }

    if (skill.length < 1) {
      return m.edit(`Nothing found for skill ${query}`);
    }

    if (skill.length > 1) {
      message.channel.send(`Found more than one skill for your query: ${skill.length} results.`);
    }

    try {
      return m.edit(EmbedCreator.createSkillEmbed(skill))
    } catch (err) {
      console.log(`ERROR: Command <skill> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      return m.edit('There was an error. I am sorry for your loss.');
    }
  }

  if (imgenCommands.includes(command)) {
    let users = message.mentions.users.map((u) => {
      return u;
    });
    let avatars = [];
    let avatar1;
    let avatar2;
    if (users.length) {
      avatar1 = message.author.avatarURL;
      avatar2 = users[0].avatarURL;
    } else {
      avatar1 = bot.user.avatarURL;
      avatar2 = message.author.avatarURL;
    }
    avatars.push(avatar1, avatar2);
    let imageName = await imgen.determineMeme(command, avatars, message.author.username, users.length ? users[0].username : null);
    await message.channel.send('', {
      file: imageName
    });

    //return fs.unlinkSync(imageName);
  }

  /**
   * Join trials!
   * 
   * Usage: 
   *  - trial create <day> <time> <trial> <eventName>
   *  - trial join <eventName> <role> <?note>
   *  - trial leave <eventName>
   */
  if (command === 'trial') {
    let guildId = message.guild.id;
    let trialCommand = args[0];
    args.shift();
    if (trialCommand === 'create') {
      let [day, time, trial, eventName] = args;
      if (day !== undefined && time !== undefined && trial !== undefined && eventName !== undefined) {
        if (!EmbedCreator.getRaidInfo(trial)) {
          return message.channel.send(`There is no trial called ${trial}.`);
        }
        await firebase.createRaid(guildId, day, time, trial, eventName);
        let raid = await firebase.getRaid(guildId, eventName);
        return message.channel.send(EmbedCreator.createEmbed(raid.day, raid.time, raid.trial, raid.name, raid.roster));
      } else {
        return message.channel.send('Could not create trial - please check command params: `trial create <day> <time> <trial> <eventName>`')
      }
    } else if (trialCommand === 'join') {
      let [eventName, role, note] = args;
      if (eventName !== undefined && role !== undefined) {
        role = role.toLowerCase();
        let eventExists = await firebase.raidExists(guildId, eventName);
        if (!eventExists) {
          return message.channel.send(`Event \`${eventName}\` does not exist.`);
        }
        let raid = await firebase.getRaid(guildId, eventName);
        let roster = raid.roster;
        let mt = ['mt', 'main-tank', 'maintank', 'main'];
        let ot = ['ot', 'off-tank', 'offtank', 'off'];
        let h = ['heal', 'heals', 'healer'];
        let stam = ['stam', 'stam-dps'];
        let mag = ['mag', 'mag-dps'];

        if (mt.includes(role)) {
          role = 'mt';
        } else if (ot.includes(role)) {
          role = 'ot';
        } else if (h.includes(role)) {
          role = 'healer';
        } else if (stam.includes(role)) {
          role = 'stam';
        } else if (mag.includes(role)) {
          role = 'mag';
        } else {
          return message.channel.send(`Invalid role: ${role}`);
        }
        let players = roster[role].players;
        if (!players) {
          players = {};
        }

        if (Object.keys(players).length < roster[role].count) {
          players[message.author.username] = {
            note: note ? `${message.author.username} - ${note}` : message.author.username
          }
        }
        roster[role].players = players;
        await firebase.updateRaid(guildId, eventName, roster);
        raid = await firebase.getRaid(guildId, eventName);
        return message.channel.send(EmbedCreator.createEmbed(raid.day, raid.time, raid.trial, raid.name, raid.roster));
      } else {
        return message.channel.search('Could not join trial -- please check params: `trial join <eventName> <role> (note -- optional one word note)`');
      }
    } else if (trialCommand === 'leave') {
      let [eventName] = args;
      if (eventName !== undefined) {
        let eventExists = await firebase.raidExists(guildId, eventName);
        if (!eventExists) {
          return message.channel.send(`Event \`${eventName}\` does not exist.`);
        }
        let raid = await firebase.getRaid(guildId, eventName);
        let roster = raid.roster;
        Object.keys(roster).forEach((role) => {
          let players = roster[role].players;
          if (players) {
            delete players[message.author.username];
          }
        })
        await firebase.updateRaid(guildId, eventName, roster);
        raid = await firebase.getRaid(guildId, eventName);
        return message.channel.send(EmbedCreator.createEmbed(raid.day, raid.time, raid.trial, raid.name, raid.roster));
      }
    } else if (trialCommand === 'help') {
      return message.channel.send('`!trial create <day> <time> <trial-name> <event-name>` -- Creates a trial in the database. Trial options are currently all in vet. **Warning**: Creating one with the same name will replace the current one.\n`!trial join <event-name> <role> <optional-note>` -- Joins the given trial with the given role -- mt, ot, heals, stam, mag. The optional note should not contain any spaces.\n`!trial leave <event-name>` -- leaves the sign-up');
    }
  }

  /**
   * THIS IS A TEST - do experimental stuff here
   */
  // if (command === 'test') {
  //   try {
  //     let results = message.mentions.users.map((u) => {
  //       return `<@${u.id}>`;
  //     });
  //     console.log(results);
  //     return message.delete();
  //   } catch (err) {
  //     console.log(`Test failed: ${err}`);
  //   }
  // }

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
        if (!res || res.text.length === 0) {
          message.channel.send('There was an error. I am sorry for your loss.');
        } else {
          message.channel.send(res.text);
        }
      }).catch(err => {
        console.error(`Translate err: ${err}`);
      });
    } catch (err) {
      console.log(`ERROR: Command <translate> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
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
      console.log(`ERROR: Command <troll> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
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
      console.log(`ERROR: Command <urban> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  /**
   * Upon popular demand, this will randomly display a quote from the warrior
   */
  if (command === 'warrior') {
    try {
      let results = message.mentions.users.map((u) => {
        return `<@${u.id}>`;
      });
      if (results.length > 0) {
        let warriorQuotes = destroy.warrior;
        results.forEach((p) => {
          let randomQuote = quoteHelper.getQuote(warriorQuotes);
          randomQuote = randomQuote.replace('@', p);
          return message.channel.send(randomQuote);
        });
      } else {
        let warriorQuotes = quotes.warrior;
        let randomQuote = quoteHelper.getQuote(warriorQuotes);
        let warriorEmoji = bot.emojis.get(emojis.customEmojis.warrior);
        return message.channel.send(`${warriorEmoji} ${randomQuote}`);
      }

    } catch (err) {
      console.log(`ERROR: Command <warrior> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  /**
   * This uses quotes from other bosses if it exists.
   * 
   * options: !rakkhat, !zmaja
   */
  if (quoteHelper.quoteOptions.includes(command)) {
    try {
      let results = message.mentions.users.map((u) => {
        return `<@${u.id}>`;
      });
      if (results.length > 0 && destroy[command]) {
        results.forEach((p) => {
          let randomQuote = quoteHelper.getQuote(destroy[command]);
          randomQuote = randomQuote.replace('@', p);
          return message.channel.send(`*${randomQuote}*`);
        });
      } else {
        let randomQuote = quoteHelper.getQuote(quotes[command]);
        return message.channel.send(randomQuote);
      }
    } catch (err) {
      console.log(`ERROR: Command <${command}> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }
});

/**
 * This is the event handler for when users add emoji reactions to a message.
 * The goal for this is to allow users to sign up for a roster by reacting
 */

// bot.on('messageReactionAdd', async (reaction, user) => {
//   // Makes sure that this event only occurs on certain messages.
//   if (reaction.message.embeds.length <= 0 || !RaidEvent) return;
//   let player = user.username;
//   if (!user.bot) {
//     let cust = emojis.customEmojis;
//     try {
//       // MT
//       if (reaction.emoji.id === cust.mt && roster.mt.count > roster.mt.players.length && !roster.mt.players.includes(player)) {
//         roster.mt.players.push(player);
//         update = true;
//       }

//       // OT
//       if (reaction.emoji.id === cust.ot && roster.ot.count > roster.ot.players.length && !roster.ot.players.includes(player)) {
//         roster.ot.players.push(player);
//       }

//       // healer
//       if (reaction.emoji.id === cust.heals && roster.healer.count > roster.healer.players.length && !roster.healer.players.includes(player)) {
//         roster.healer.players.push(player);
//       }

//       // stam
//       if (reaction.emoji.id === cust.stam && roster.stam.count > roster.stam.players.length && !roster.stam.players.includes(player)) {
//         roster.stam.players.push(player);
//       }

//       // mag
//       if (reaction.emoji.id === cust.mag && roster.mag.count > roster.mag.players.length && !roster.mag.players.includes(player)) {
//         roster.mag.players.push(player);
//       }

//       // cancel
//       if (reaction.emoji.name === '❌') {
//         Object.keys(roster).forEach((role) => {
//           _.remove(roster[role].players, (p) => {
//             return p === player;
//           });
//         });
//       }
//     } catch (err) {
//       console.log(`ERROR: Event <messageReaction> failed.\n\tError: [${err}]`);
//     }

//     try {
//       reaction.message.edit(EmbedCreator.createEmbed(RaidEvent.day, RaidEvent.time, RaidEvent.title, roster));
//       reaction.remove(user);
//     } catch (err) {
//       console.log(`Error with message edit or remove: ${err}`);
//     }
//   }
// });

