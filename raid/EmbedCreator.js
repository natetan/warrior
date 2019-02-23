let Discord = require('discord.js');
let _ = require('lodash');

let RaidInfo = require('./RaidInfo.json');
let logos = require('../resources/logos.json');
let DateHelper = require('../helpers/DateHelper');

/**
 * Returns the json object related to the raid
 * 
 * @param {String} raidName - name of the raid 
 * @returns {Object}
 */
function getRaidInfo(raidName) {
  raidName = raidName.toLowerCase();
  if (!RaidInfo[raidName]) {
    return new Error(`Raid \`${raidName}\` does not exist, you scrub.`);
  }
  return RaidInfo[raidName];
}

/**
 * Creates a roster based on the raid
 * 
 * @param {String} raid - Raid name
 * @returns {Object}
 */
function createRoster(raid) {
  let comp = raid.comp;
  let roles = Object.keys(comp);
  let roster = {};
  roles.forEach((role) => {
    roster[role] = {
      'count': comp[role],
      'players': []
    }
  });
  return roster;
}

/**
 * Creates a Discord embed for sign-ups
 * 
 * @param {String} day - day of the week
 * @param {String} time - time
 * @param {String} title - raidName
 * @param {Object} roster - Roster object
 */
function createEmbed(day, time, title, roster) {
  let raid = getRaidInfo(title);
  let date = DateHelper.getNextDay(day);
  if (date instanceof Error) {
    return date;
  }
  let cpDisplay = '';
  raid.cp.forEach((setup) => {
    let results = '';
    let perks = Object.keys(setup.points);
    perks.forEach((perk) => {
      results += `${perk} - ${setup.points[perk]}\n`
    });
    cpDisplay += `**${setup.type}**:\n${results}\n`;
    //cpDisplay += `${setup.type}:\n ${JSON.stringify(setup.points)}\n`;
  });

  let embed = new Discord.RichEmbed()
    .setColor('#ff6600')
    .setTitle(`${DateHelper.getNextDay(day)} @ ${time} ${raid['short_name']}`)
    .setThumbnail(logos['2']);

  let roles = Object.keys(roster);
  roles.forEach((role) => {
    let results = '';
    let roleCount = roster[role].count;
    if (roleCount > 0) {
      for (let i = 0; i < roleCount; i++) {
        let player = '--';
        if (roster[role].players[i]) {
          player = roster[role].players[i];
        }
        results += `${player}\n`;
        // embed.addField(`${role.toUpperCase()}`, player, true);
      }
      embed.addField(role.toUpperCase(), results, true);
    }
  });
  embed.addField('CP', cpDisplay, true);
  return embed;
}

/**
 * Create a Discord embed for roles
 * 
 * @param {Object} - Discord's role object 
 * @param {String} - The type of role categorization 
 * @returns {RichEmbed}
 */
function createRoleEmbed(data, type) {
  let embed = new Discord.RichEmbed()
    .setColor('#ff6600')
    .setTitle(`Roles: ${type}`)
    .setThumbnail(logos['2']);

  if (type.toLowerCase() === 'all') {
    Object.keys(data).forEach((role) => {
      if (role !== '@everyone') {
        embed.addField(role, data[role].length > 0 ? data[role] : '--', true);
      }
    });
  } else if (type.toLowerCase() === 'count') {
    Object.keys(data).forEach((role) => {
      embed.addField(role, data[role], true);
    });
  } else {
    let results = '';
    Object.values(data).forEach((role) => {
      if (role !== '@everyone') {
        results += `${role}\n`;
      }
    });
    embed.addField('Roles', results, true);
  }
  return embed;
}

module.exports = {
  getRaidInfo,
  createRoster,
  createEmbed: createEmbed,
  createRoleEmbed: createRoleEmbed
}