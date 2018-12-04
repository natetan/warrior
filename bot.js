let Discord = require('discord.io');
let logger = require('winston');
let auth = require('./auth.json');
let warrior = require('./resources/warrior-quotes.json');

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
  if (message.substring(0, 1) === '!') {
    var args = message.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
      // !help
      case 'help':
        bot.sendMessage({
          to: channelID,
          message: 'Git Gud'
        });
        break;
      // Just add any case commands if you want to..
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
          //message: `Sorry ${user}, but this is not implemented yet.`
          message: randomQuote
        })
      break;
    }
  }
});