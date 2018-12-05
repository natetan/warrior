let Discord = require('discord.io');
let logger = require('winston');
let auth = require('./auth.json');
let warrior = require('./resources/warrior-quotes.json');
let RaidHelper = require('./helpers/RaidHelper');

var RaidEvent = undefined;

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
let bot = new Discord.Client({
  token: auth.token,
  autorun: true
});

bot.on('ready', (evt) => {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  const prefix = '!';

  if (!message.startsWith(prefix)) return;
  if (message.startsWith(prefix)) {
    //var args = message.substring(1).split(' ');
    //var cmd = args[0];

    //args = args.splice(1);
    let args = message.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    switch (cmd) {
      // !help
      case 'help':
        bot.sendMessage({
          to: channelID,
          message: 'Git Gud'
        });
        break;
      case 'whoami':
        bot.sendMessage({
          to: channelID,
          message: `User: ${user}\nUserID: ${userID}`
        })
        break;
      case 'warrior':
        let quotes = warrior.quotes;
        let length = quotes.length;
        let randomQuote = quotes[Math.floor(Math.random() * length)];
        bot.sendMessage({
          to: channelID,
          message: randomQuote
        })
        break;
      case 'raid':
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
          bot.sendMessage({
            to: channelID,
            message: msg
          })
        } else if (raidCommand === 'join') {
          let msg = 'No raid available';
          if (RaidEvent !== undefined) {
            let role = args[0];
            if (role === undefined) {
              msg = 'Need a role';
            } else {
              RaidEvent.roster.add(user, role);
              msg = RaidHelper.printRaid(RaidEvent, RaidEvent.roster);
            }
          }
          bot.sendMessage({
            to: channelID,
            message: msg
          })
        } else if (raidCommand === 'drop') {
          let msg = 'No raid available';
          if (RaidEvent !== undefined) {
            RaidEvent.roster.remove(user);
            msg = RaidHelper.printRaid(RaidEvent, RaidEvent.roster);
          }
          bot.sendMessage({
            to: channelID,
            message: msg
          })
        } else if (raidCommand === 'roster') {
          let msg = 'No raid available';
          if (RaidEvent !== undefined) {
            msg = RaidHelper.printRaid(RaidEvent, RaidEvent.roster);
          }
          bot.sendMessage({
            to: channelID,
            message: msg
          })
        } else if (raidCommand === 'delete') {
          let msg = 'No raid available';
          if (RaidEvent !== undefined) {
            msg = `Raid ${RaidEvent.title} @ ${RaidEvent.time} deleted`
            RaidEvent = undefined;
          }
          bot.sendMessage({
            to: channelID,
            message: msg
          })
        } else if (raidCommand === 'help') {
          bot.sendMessage({
            to: channelID,
            message: 'Available commands:\n- <create> [name] [time]\n- <join> [role]\n- <drop>\n- <roster>\n- <delete>'
          })
        }

        break;
    }
  }
});