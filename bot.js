const Discord = require('discord.js');
const logger = require('winston');
const _ = require('lodash');

const quoteHelper = require('./quotes/QuoteHelper');
const quotes = require('./resources/quotes.json');
const destroy = require('./resources/destroy.json');
const commands = require('./resources/commands.json');
const languages = require('./translate/TranslateHelper');
const emojis = require('./resources/emojis');
const strings = require('./resources/strings');
const firebase = require('./db/FirebaseHelper');
const sets = require('./sets/EsoSets');
const skills = require('./skills/EsoSkills');
const imgen = require('./imgen/ImageManipulator');
const getMusic = require('./spotify/getMusic');

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

// Image manipulation commands
const imgenCommands = ['airpods', 'egg', 'rip', 'shit', 'slap', 'vma'];


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
    let randomQuote = quoteHelper.getQuote(retorts);
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

  // if (command === 'roast') {
  //   let retorts = quotes.retort;
  //   let randomQuote = quoteHelper.getQuote(retorts);
  //   try {
  //     await message.channel.send(randomQuote);
  //   } catch (err) {
  //     console.log(`ERROR: on roast.\n\tMessage: [${message}]\n\tError: [${err}]`);
  //   }
  // }

  // /**
  //  * Handles the roles of the members of the server
  //  * 
  //  * @arg all - gets all the roles and shows every user in those roles
  //  * @arg count - gets all the roles and the counts of how many people are in those roles
  //  * @arg default - gets the message sender's roles
  //  */
  // if (command === 'roles') {
  //   try {
  //     let channel = message.channel;
  //     let results = {};
  //     if (args[0] === 'all') {
  //       message.guild.roles.forEach((v) => {
  //         let members = v.members.map((m) => {
  //           return m.displayName;
  //         });
  //         // Ignore the @everyone tag since that can have a lot of users
  //         if (v.name !== '@everyone') {
  //           results[v.name] = members;
  //         }
  //       });
  //       results = EmbedCreator.createRoleEmbed(results, 'ALL');
  //     } else if (args[0] === 'count') {
  //       message.guild.roles.forEach((v) => {
  //         results[v.name] = v.members.keyArray().length;
  //       });
  //       results = EmbedCreator.createRoleEmbed(results, 'COUNT');
  //     } else {
  //       message.member.roles.forEach((v, k) => {
  //         results[k] = v.name;
  //       });
  //       results = EmbedCreator.createRoleEmbed(results, message.author.username);
  //     }
  //     await channel.send(results);
  //   } catch (err) {
  //     console.log(`ERROR: Command <roles> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
  //   }
  // }

  // /**
  //  * Gets sets from https://eso-sets.com
  //  * 
  //  * Users can either look for an item string or its ID.
  //  * 
  //  * @arg query - name of item or id of item
  //  */
  // if (command === 'set') {
  //   let query = args.join(' ');
  //   if (!query) {
  //     return message.channel.send('Command `!set` requires arguments: `!set <name>` or `!set <id>`.');
  //   }
  //   let m = await message.channel.send('Grabbing set from `eso-sets`...');
  //   let set;
  //   if (Number(query)) {
  //     set = await sets.GetSetById(query);
  //   } else {
  //     set = await sets.GetSetByName(query);
  //   }

  //   if (!set) {
  //     return m.edit('There was an error with your query.');
  //   }

  //   if (set.length < 1) {
  //     return m.edit(`Nothing found for set ${query}`);
  //   }

  //   if (set.length > 1) {
  //     message.channel.send(`Found more than one set for your query: ${set.length} results.`);
  //   }

  //   try {
  //     return m.edit(EmbedCreator.createSetEmbed(set))
  //   } catch (err) {
  //     console.log(`ERROR: Command <set> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
  //     return m.edit('There was an error. I am sorry for your loss.');
  //   }
  // }

  // /**
  //  * Gets skills from https://eso-skillbook.com
  //  * 
  //  * Users can either look for an item string or its ID.
  //  * 
  //  * @arg query - name of item or id of item
  //  */
  // if (command === 'skill') {
  //   let query = args.join(' ');
  //   if (!query) {
  //     return message.channel.send('Command `!skill` requires arguments: `!skill <name>` or `!skill <id>`.');
  //   }
  //   let m = await message.channel.send('Grabbing set from `eso-skillbook`...');
  //   let skill;
  //   if (Number(query)) {
  //     skill = await skills.GetSkillById(query);
  //   } else {
  //     skill = await skills.GetSkillByName(query);
  //   }

  //   if (!skill) {
  //     return m.edit('There was an error with your query.');
  //   }

  //   if (skill.length < 1) {
  //     return m.edit(`Nothing found for skill ${query}`);
  //   }

  //   if (skill.length > 1) {
  //     message.channel.send(`Found more than one skill for your query: ${skill.length} results.`);
  //   }

  //   try {
  //     return m.edit(EmbedCreator.createSkillEmbed(skill))
  //   } catch (err) {
  //     console.log(`ERROR: Command <skill> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
  //     return m.edit('There was an error. I am sorry for your loss.');
  //   }
  // }

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

  // if (command === 'song') {
  //   let query = args.join(' ');
  //   if (!query) {
  //     return message.channel.send('There was nothing queried you doofus.');
  //   }
  //   let m = await message.channel.send('Fetching song from spotify...');
  //   let song = await getMusic(query);
  //   if (song instanceof Error) {
  //     return m.edit(song.message);
  //   }
  //   song = song.tracks.items[0];
  //   if (!song) {
  //     return m.edit('There was an error.');
  //   }
  //   let songEmbed = EmbedCreator.createSongEmbed(song);
  //   return m.edit(songEmbed);
  // }

  // /**
  //  * Join trials!
  //  * 
  //  * Usage: 
  //  *  - trial create <day> <time> <trial> <eventName>
  //  *  - trial join <eventName> <role> <?note>
  //  *  - trial leave <eventName>
  //  */
  // if (command === 'trial') {
  //   let guildId = message.guild.id;
  //   let trialCommand = args[0];
  //   args.shift();
  //   if (trialCommand === 'create') {
  //     let [day, time, trial, eventName] = args;
  //     if (day !== undefined && time !== undefined && trial !== undefined && eventName !== undefined) {
  //       if (!EmbedCreator.getRaidInfo(trial)) {
  //         return message.channel.send(`There is no trial called ${trial}.`);
  //       }
  //       await firebase.createRaid(guildId, day, time, trial, eventName);
  //       let raid = await firebase.getRaid(guildId, eventName);
  //       return message.channel.send(EmbedCreator.createEmbed(raid.day, raid.time, raid.trial, raid.name, raid.roster));
  //     } else {
  //       return message.channel.send('Could not create trial - please check command params: `trial create <day> <time> <trial> <eventName>`')
  //     }
  //   } else if (trialCommand === 'join') {
  //     let [eventName, role, note] = args;
  //     if (eventName !== undefined && role !== undefined) {
  //       role = role.toLowerCase();
  //       let eventExists = await firebase.raidExists(guildId, eventName);
  //       if (!eventExists) {
  //         return message.channel.send(`Event \`${eventName}\` does not exist.`);
  //       }
  //       let raid = await firebase.getRaid(guildId, eventName);
  //       let roster = raid.roster;
  //       let mt = ['mt', 'main-tank', 'maintank', 'main'];
  //       let ot = ['ot', 'off-tank', 'offtank', 'off'];
  //       let h = ['heal', 'heals', 'healer'];
  //       let stam = ['stam', 'stam-dps'];
  //       let mag = ['mag', 'mag-dps'];

  //       if (mt.includes(role)) {
  //         role = 'mt';
  //       } else if (ot.includes(role)) {
  //         role = 'ot';
  //       } else if (h.includes(role)) {
  //         role = 'healer';
  //       } else if (stam.includes(role)) {
  //         role = 'stam';
  //       } else if (mag.includes(role)) {
  //         role = 'mag';
  //       } else {
  //         return message.channel.send(`Invalid role: ${role}`);
  //       }
  //       let players = roster[role].players;
  //       if (!players) {
  //         players = {};
  //       }

  //       if (Object.keys(players).length < roster[role].count) {
  //         players[message.author.username] = {
  //           note: note ? `${message.author.username} - ${note}` : message.author.username
  //         }
  //       }
  //       roster[role].players = players;
  //       await firebase.updateRaid(guildId, eventName, roster);
  //       raid = await firebase.getRaid(guildId, eventName);
  //       return message.channel.send(EmbedCreator.createEmbed(raid.day, raid.time, raid.trial, raid.name, raid.roster));
  //     } else {
  //       return message.channel.search('Could not join trial -- please check params: `trial join <eventName> <role> (note -- optional one word note)`');
  //     }
  //   } else if (trialCommand === 'leave') {
  //     let [eventName] = args;
  //     if (eventName !== undefined) {
  //       let eventExists = await firebase.raidExists(guildId, eventName);
  //       if (!eventExists) {
  //         return message.channel.send(`Event \`${eventName}\` does not exist.`);
  //       }
  //       let raid = await firebase.getRaid(guildId, eventName);
  //       let roster = raid.roster;
  //       Object.keys(roster).forEach((role) => {
  //         let players = roster[role].players;
  //         if (players) {
  //           delete players[message.author.username];
  //         }
  //       })
  //       await firebase.updateRaid(guildId, eventName, roster);
  //       raid = await firebase.getRaid(guildId, eventName);
  //       return message.channel.send(EmbedCreator.createEmbed(raid.day, raid.time, raid.trial, raid.name, raid.roster));
  //     }
  //   } else if (trialCommand === 'help') {
  //     return message.channel.send('`!trial create <day> <time> <trial-name> <event-name>` -- Creates a trial in the database. Trial options are currently all in vet. **Warning**: Creating one with the same name will replace the current one.\n`!trial join <event-name> <role> <optional-note>` -- Joins the given trial with the given role -- mt, ot, heals, stam, mag. The optional note should not contain any spaces.\n`!trial leave <event-name>` -- leaves the sign-up');
  //   }
  // }

  // /**
  //  * THIS IS A TEST - do experimental stuff here
  //  */
  // if (command === 'test') {
  //   let testEmbed = EmbedCreator.createExampleEmbed();
  //   try {
  //     let m = await message.channel.send(testEmbed);
  //     await m.react(emojis.examples.mt);
  //     await m.react(emojis.examples.ot);
  //     await m.react(emojis.examples.heals);
  //     await m.react(emojis.examples.stam);
  //     await m.react(emojis.examples.mag);
  //     await m.react(emojis.examples.cancel);

  //     const filter = (reaction, user) => {
  //       return Object.values(emojis.examples).includes(reaction.emoji.name) && user.id !== m.author.id;
  //     }

  //     m.awaitReactions(filter, { max: 2, time: 604800, errors: ['time'] })
  //       .then((collected) => {
  //         console.log('test');
  //         console.log(`<@${collected.first().users.first().id}>`);
  //         let usersList = [];
  //         collected.first().users.forEach((u) => {
  //           if (!u.bot) {
  //             usersList.push(u.username);
  //           }
  //         })
  //         message.channel.send(usersList);
  //       })
  //       .catch((collected) => {
  //         console.log('end');
  //         console.log(`After 1 second, we got ${collected.size} reactions`);
  //       });

  //   } catch (err) {
  //     console.log(`Error in testing: ${err}`);
  //   }
  // }

  // /**
  //  * Uses the google translate api to translate text
  //  * 
  //  * @arg targetLang - target language to translate to
  //  * @arg textToTranslate - text that will be translated
  //  */
  // if (command === 'translate') {
  //   // syntax: command targetLang text
  //   try {
  //     let targetLang = args[0]
  //     if (targetLang.toLowerCase() == 'chinese') {
  //       targetLang = 'chinese-simplified';
  //     }
  //     args.shift();
  //     let textToTranslate = args.join(' ');

  //     translate(textToTranslate, { to: languages.getCode(targetLang) }).then(res => {
  //       if (!res || res.text.length === 0) {
  //         message.channel.send('There was an error. I am sorry for your loss.');
  //       } else {
  //         message.channel.send(res.text);
  //       }
  //     }).catch(err => {
  //       console.error(`Translate err: ${err}`);
  //     });
  //   } catch (err) {
  //     console.log(`ERROR: Command <translate> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
  //   }
  // }

  // // Send a message to SnF general chat
  // if (command === 'troll') {
  //   try {
  //     let phrase = args.join(' ');
  //     let openRunsChannel = client.channels.get(process.env.troll_channel_id || require('./auth.json').bot_test_general_channel_id);

  //     if (!openRunsChannel) {
  //       message.channel.send('Channel does not exist');
  //     } else {
  //       openRunsChannel.send(phrase);
  //     }
  //   } catch (err) {
  //     console.log(`ERROR: Command <troll> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
  //   }
  // }

  // /**
  //  * Uses the urban dictionary API to define words
  //  * 
  //  * @arg word - the word to define
  //  */
  // if (command === 'urban') {
  //   try {
  //     let word = args.join(' ');
  //     let defObject = await define.getUrbanDefinition(word);
  //     let definition;
  //     if (!defObject || defObject.error) {
  //       definition = `Either UrbanDictionary didn't have the term \`${word}\` or you're just looking up some strange things, my friend.`;
  //     } else {
  //       definition = defObject;
  //     }
  //     message.channel.send(`${definition}`);
  //   } catch (err) {
  //     console.log(`ERROR: Command <urban> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
  //   }
  // }

  // /**
  //  * Upon popular demand, this will randomly display a quote from the warrior
  //  */
  // if (command === 'warrior') {
  //   try {
  //     let results = message.mentions.users.map((u) => {
  //       return `<@${u.id}>`;
  //     });
  //     if (results.length > 0) {
  //       let warriorQuotes = destroy.warrior;
  //       results.forEach((p) => {
  //         let randomQuote = quoteHelper.getQuote(warriorQuotes);
  //         randomQuote = randomQuote.replace('@', p);
  //         return message.channel.send(randomQuote);
  //       });
  //     } else {
  //       let warriorQuotes = quotes.warrior;
  //       let randomQuote = quoteHelper.getQuote(warriorQuotes);
  //       let warriorEmoji = client.emojis.get(emojis.customEmojis.warrior);
  //       return message.channel.send(`${warriorEmoji} ${randomQuote}`);
  //     }

  //   } catch (err) {
  //     console.log(`ERROR: Command <warrior> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
  //   }
  // }

  // /**
  //  * This uses quotes from other bosses if it exists.
  //  * 
  //  * options: !rakkhat, !zmaja
  //  */
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

