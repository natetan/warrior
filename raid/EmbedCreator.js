let Discord = require('discord.js');
let _ = require('lodash');

let RaidInfo = require('./RaidInfo.json');
let logos = require('../resources/logos.json');

function getRaidInfo(raidName) {
  raidName = raidName.toLowerCase();
  return RaidInfo[raidName];
}

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

function createEmbed(title, time, roster) {
  let raid = getRaidInfo(title);
  if (raid === undefined) {
    return null;
  }
  let cpDisplay = '';
  raid.cp.forEach((setup) => {
    cpDisplay += `${setup.type}:\n ${JSON.stringify(setup.points)}\n`;
  });

  let embed = new Discord.RichEmbed()
  .setColor('#0099ff')
  .setTitle(`${raid['short_name']} @ ${time}`)
  .setDescription(cpDisplay)
  .setThumbnail(logos['2']);

  let roles = Object.keys(roster);
  roles.forEach((role) => {
    let roleCount = roster[role].count;
    for (let i = 0; i < roleCount; i++) {
      let player = '--';
      if (roster[role].players[i]) {
        player = roster[role].players[i];
      }
      embed.addField(role.toUpperCase(), player, true);
    }
  });
  return embed;
}

module.exports = {
  getRaidInfo,
  createRoster,
  createEmbed: createEmbed
}