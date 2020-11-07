const raidHelper = require('../database/raid');
const eu = require('../utils/embedUtils');

/**
 * Join trials!
 * 
 * Usage: 
 *  - trial create <day> <time> <trial> <eventName>
 *  - trial join <eventName> <role> <note?>
 *  - trial leave <eventName>
 *  - trial help
 */
module.exports = {
  name: 'trial',
  desc: 'Manage raids. See !trial help for more info.',
  args: true,
  usage: '<create>, <join>, <delete>, <help>',
  examples: [
    'create fri 11 vcr test',
    'join test mag orb-killer',
    'leave test'
  ],
  commandType: 'special',
  category: 'trials',
  async execute(message, args, client) {
    let guildId = message.guild.id;
    let trialCommand = args[0];
    args.shift();
    if (trialCommand === 'create') {
      let [day, time, trial, eventName] = args;
      if (day !== undefined && time !== undefined && trial !== undefined && eventName !== undefined) {
        if (!eu.getRaidInfo(trial)) {
          return message.channel.send(`There is no trial called ${trial}.`);
        }
        await raidHelper.createRaid(guildId, day, time, trial, eventName);
        let raid = await raidHelper.getRaid(guildId, eventName);
        return message.channel.send(eu.createTrial(raid.day, raid.time, raid.trial, raid.name, raid.roster));
      } else {
        return message.channel.send('Could not create trial - please check command params: `trial create <day> <time> <trial> <eventName>`')
      }
    } else if (trialCommand === 'join') {
      let [eventName, role, note] = args;
      if (eventName !== undefined && role !== undefined) {
        role = role.toLowerCase();
        let eventExists = await raidHelper.raidExists(guildId, eventName);
        if (!eventExists) {
          return message.channel.send(`Event \`${eventName}\` does not exist.`);
        }
        let raid = await raidHelper.getRaid(guildId, eventName);
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
        await raidHelper.updateRaid(guildId, eventName, roster);
        raid = await raidHelper.getRaid(guildId, eventName);
        return message.channel.send(eu.createTrial(raid.day, raid.time, raid.trial, raid.name, raid.roster));
      } else {
        return message.channel.search('Could not join trial -- please check params: `trial join <eventName> <role> (note -- optional one word note)`');
      }
    } else if (trialCommand === 'leave') {
      let [eventName] = args;
      if (eventName !== undefined) {
        let eventExists = await raidHelper.raidExists(guildId, eventName);
        if (!eventExists) {
          return message.channel.send(`Event \`${eventName}\` does not exist.`);
        }
        let raid = await raidHelper.getRaid(guildId, eventName);
        let roster = raid.roster;
        Object.keys(roster).forEach((role) => {
          let players = roster[role].players;
          if (players) {
            delete players[message.author.username];
          }
        })
        await raidHelper.updateRaid(guildId, eventName, roster);
        raid = await raidHelper.getRaid(guildId, eventName);
        return message.channel.send(eu.createTrial(raid.day, raid.time, raid.trial, raid.name, raid.roster));
      }
    } else if (trialCommand === 'help') {
      return message.channel.send('`!trial create <day> <time> <trial-name> <event-name>` -- Creates a trial in the database. Trial options are currently all in vet. **Warning**: Creating one with the same name will replace the current one.\n`!trial join <event-name> <role> <optional-note>` -- Joins the given trial with the given role -- mt, ot, heals, stam, mag. The optional note should not contain any spaces.\n`!trial leave <event-name>` -- leaves the sign-up');
    }
  }
}