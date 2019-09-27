const Discord = require('discord.js');
const logger = require('winston');
const _ = require('lodash');

const quoteHelper = require('./quotes/QuoteHelper');
const quotes = require('./resources/quotes.json');
const destroy = require('./resources/destroy.json');
const commands = require('./resources/commands.json');
const languages = require('./translate/TranslateHelper');
const define = require('./define/define');
const emojis = require('./resources/emojis');
const EmbedCreator = require('./raid/EmbedCreator');
const strings = require('./resources/strings');
const firebase = require('./db/FirebaseHelper');
const sets = require('./sets/EsoSets');
const skills = require('./skills/EsoSkills');
const pledges = require('./pledges/EsoPledges');
const meow = require('./meow/Meow');
const memes = require('./memes/Memes');
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

// Important roles that have permission
const permissionRoles = ['Admin', 'bot', 'Core'];

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

  // if (command === 'expose') {
  //   try {
  //     let user = message.author;
  //     if (message.mentions.users.size) {
  //       user = message.mentions.users.first();
  //     }
  //     return message.channel.send(`That is **${user.username}**. This person joined discord on ${new Date(user.createdAt).toISOString().substring(0, 10)}`);
  //   } catch (err) {
  //     console.log('error in expose');
  //   }
  // }

  // /**
  //  * Get the user's ID, and then deletes the message
  //  */
  // if (command === 'uid') {
  //   try {
  //     console.log(`The ID of user ${message.author.username} is ${message.author.id}`);
  //     await message.delete();
  //   } catch (err) {
  //     console.log(`ERROR: Command <uid> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
  //   }
  // }

  // // Logs out all the members and their ids in the channel and deletes the message
  // if (command === 'ids') {
  //   try {
  //     let res = {};
  //     message.channel.members.forEach((member) => {
  //       res[member.user.username] = member.user.id
  //     });
  //     console.log(res);
  //     await message.delete();
  //   } catch (err) {
  //     console.log(`ERROR: Command <ids> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
  //   }
  // }

  // /**
  //  * Uses the Oxford dictionary API to define words
  //  * 
  //  * @arg word - the word to define
  //  */
  // if (command === 'define') {
  //   try {
  //     let word = args.join(' ');
  //     let term = await define.getDefinition(word);
  //     if (term.error) {
  //       return message.channel.send(term.errorMessage);
  //     }

  //     let embed = EmbedCreator.createDefinitionEmbed(term);
  //     return message.channel.send(embed);
  //   } catch (err) {
  //     console.log(`ERROR: Command <define> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
  //   }
  // }

  // // Firebase stuff
  // if (command === 'fb') {
  //   let fbCommand = args[0];
  //   if (!fbCommand) {
  //     return await message.channel.send(`Command !fb requires parameters: !fb <command>`);
  //   }
  //   if (fbCommand === 'init') {
  //     let guildId = message.guild.id;
  //     let guildName = message.guild.name;
  //     let guildOwner = message.guild.owner.displayName;
  //     await firebase.initializeGuild(guildId, guildName, guildOwner);
  //     return message.delete();
  //   }
  // }

  // /**GAMBLING GAME */
  // if (command === 'game') {
  //   let gameCommand = args[0];
  //   if (!gameCommand) {
  //     return await message.channel.send(`Command !game requires parameters: !game <command>`);
  //   }
  //   let guildId = message.guild.id;
  //   if (gameCommand === 'setup') {
  //     let hasPermission = message.member.roles.some(r => permissionRoles.includes(r.name));
  //     if (!hasPermission) {
  //       return message.channel.send(`${message.author}, you do not have permission to use this command`);
  //     }
  //     try {
  //       args.shift();
  //       let amount = args[0];
  //       let members = message.guild.members;
  //       let players = [];
  //       let startingAmount = Number(amount) || 200000;
  //       members.forEach((m) => {
  //         let member = {
  //           name: m.user.username,
  //           funds: startingAmount
  //         };
  //         players.push(member)
  //       });
  //       let errorNames = await firebase.setUpPlayers(guildId, players);
  //       if (errorNames.length === 0) {
  //         message.channel.send(`Setup complete! All players in this server have been setup with $${startingAmount}`);
  //       } else {
  //         message.channel.send(`Setup complete! However, here are the players that could not be added: \`${errorNames.toString()}\` because their names contained: \`.\`, \`#\`, \`$\`, \`[\`, or \`]\``);
  //       }
  //     } catch (err) {
  //       console.log(`ERROR: Command <${command}> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
  //     }
  //   } else if (gameCommand === 'funds') {
  //     let userExists = await firebase.userExists(guildId, message.author.username);
  //     if (!userExists) {
  //       return message.channel.send('You do not exist in the database. I cannot retrieve your funds. I\'d add you in, but that\'s against protocol. Try `!help`.');
  //     }
  //     let funds = await firebase.getPlayerFunds(guildId, message.author.username);
  //     let msg = `${message.author}, you have $${funds}`;
  //     if (!funds && funds > 0) {
  //       msg = `Sorry, ${message.author} I could not retrieve your funds. Either there was an error on my end, or you're just a bum.`;
  //     }
  //     message.channel.send(msg);
  //   } else if (gameCommand === 'give') {
  //     let userExists = await firebase.userExists(guildId, message.author.username);
  //     if (!userExists) {
  //       return message.channel.send('You do not exist in the database. I cannot retrieve your funds. I\'d add you in, but that\'s against protocol. Try `!help`.');
  //     }
  //     args.shift();
  //     let receiver = args[0];
  //     // Receiver looks like this: <@123456789>
  //     receiver = receiver.replace(/\</g, '').replace(/\>/g, '').replace(/@/g, '');
  //     let user;

  //     // We'll try to parse a user from an @, and if that fails, use what they typed
  //     // i.e. @Aerovertics vs aerovertics
  //     try {
  //       user = await client.fetchUser(receiver);
  //     } catch (err) {
  //       console.log(`SUPPRESSING ERROR: ${err}. Attempting to use actual string.`);
  //       user = receiver;
  //     }

  //     let receiverName = user.username || user;
  //     let receiverExists = await firebase.userExists(guildId, receiverName);
  //     if (!receiverExists) {
  //       return message.channel.send(`${receiverName} does not exist in the database.`);
  //     }

  //     args.shift();
  //     let amount = args[0];

  //     if (!amount) {
  //       return message.channel.send(`${message.author}, you must input an amount to give.`);
  //     }

  //     if (!Number(amount)) {
  //       return message.channel.send(`${message.author}, that's not an integer I can parse, you vitamin-d deficient clown.`);
  //     }

  //     amount = Math.floor(amount);

  //     if (amount < 1) {
  //       return message.channel.send(`${message.author}, you must give an amount greater than 0 you frugally poor dweeb.`);
  //     }

  //     let senderFunds = await firebase.getPlayerFunds(guildId, message.author.username);
  //     if (amount > senderFunds) {
  //       return message.channel.send(`${message.author}, you can't send more than you have. Balance: $${senderFunds}`);
  //     }

  //     receiverFunds = await firebase.updatePlayerFunds(guildId, receiverName, amount);
  //     senderFunds = await firebase.updatePlayerFunds(guildId, message.author.username, amount * -1);
  //     return message.channel.send(`Transfer complete!\n\t${message.author.username}: $${senderFunds}\n\t${receiverName}: $${receiverFunds}`);
  //   } else {
  //     return await message.channel.send(`!game ${gameCommand} is not valid.`);
  //   }
  // }

  // // The actual help command.
  // if (command === 'halp') {
  //   try {
  //     let general = EmbedCreator.createGeneralHelpEmbed(commands);
  //     let special = EmbedCreator.createSpecializedHelpEmbed(commands);
  //     await message.channel.send(general);
  //     return message.channel.send(special);
  //   } catch (err) {
  //     console.log(`Test failed: ${err}`);
  //   }
  // }

  // // Snail's first command lmao
  // if (command === 'help') {
  //   try {
  //     await message.channel.send('Git Gud');
  //   } catch (err) {
  //     console.log(`ERROR: Command <help> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
  //   }
  // }

  // if (command === 'inviteurl') {
  //   console.log(`Invite link: https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot`);
  //   return message.delete();
  // }

  // if (command === 'meme') {
  //   let subreddit = args[0];
  //   let m;
  //   if (subreddit) {
  //     m = await message.channel.send(`Fetching meme from r/${subreddit}`);
  //   } else {
  //     m = await message.channel.send('Fetching random meme from r/memes, r/dankmemes, and r/meirl');
  //   }
  //   try {
  //     let meme = await memes.getRandomMeme(subreddit);
  //     if (meme.status_code && meme.status_code === 404) {
  //       return m.edit(`Subreddit r/${subreddit} not found.`);
  //     }
  //     let embed = EmbedCreator.createMemeEmbed(meme);
  //     return m.edit(embed);
  //   } catch (err) {
  //     console.log(`There was an error: ${err}`);
  //     return m.edit('Sorry, an error occured.');
  //   }
  // }

  // if (command === 'meow') {
  //   try {
  //     let catResponse = await meow.getRandomCat();
  //     message.channel.send(catResponse.file);
  //   } catch (err) {
  //     console.log(`ERROR: Command <meow> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
  //     message.channel.send('There was an error. No cats for you.');
  //   }
  // }

  // // Calculates the ping 
  // if (command === 'ping') {

  // }

  // /**
  //  * Gets the daily pledges
  //  */
  // if (command === 'pledges') {
  //   try {
  //     let m = await message.channel.send('Grabbing pledges from Dwemer Automaton...');
  //     let dailies = await pledges.getPledges();
  //     let embed = EmbedCreator.createPledgesEmbed(dailies);
  //     m.edit(embed);
  //   } catch (err) {
  //     console.log(`ERROR: Command <pledges> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
  //   }
  // }

  // // Purge
  // if (command === 'purge') {
  //   // Checks if the user is in a role that has permission
  //   // So far, roles include: Admin
  //   let hasPermission = message.member.roles.some(r => permissionRoles.includes(r.name));
  //   if (!hasPermission) {
  //     return message.channel.send(`${message.author}, you do not have permission to use this command`);
  //   }
  //   const deleteCount = Number(args[0]);
  //   let min = 1;
  //   let max = 20;
  //   if (!deleteCount || deleteCount <= min || deleteCount > max) {
  //     return message.reply(`Please provide a number between ${min} (exclusive) and ${max} (inclusive) for the number of messages to delete.`);
  //   }
  //   try {
  //     const recentMessages = await message.channel.fetchMessages({ limit: deleteCount });
  //     message.channel.bulkDelete(recentMessages).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  //   } catch (err) {
  //     console.log(`ERROR: Command <purge> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
  //   }
  // }

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

