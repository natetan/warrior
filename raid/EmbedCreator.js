const Discord = require('discord.js');
const _ = require('lodash');

const RaidInfo = require('./RaidInfo.json');
const logos = require('../resources/logos.json');
const displayUtils = require('../utils/displayUtils');

/**
 * Returns the json object related to the raid
 * 
 * @param {String} raidName - name of the raid 
 * @returns {Object}
 */
function getRaidInfo(raidName) {
  raidName = raidName.toLowerCase();
  if (raidName === 'vmaw') {
    raidName = 'vmol';
  }
  
  return RaidInfo[raidName] ? RaidInfo[raidName] : null;
}

/**
 * Creates a roster based on the raid
 * 
 * @param {Object} raid - Raid object
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
    switch (role) {
      case 'mt':
        roster[role].priority = 1;
        break;
      case 'ot':
        roster[role].priority = 2;
        break;
      case 'healer':
        roster[role].priority = 3;
        break;
      case 'stam':
        roster[role].priority = 4;
        break;
      default:
        roster[role].priority = 5;
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
 * 
 * @returns {Discord.RichEmbed} - Discord Embed
 */
function createEmbed(day, time, title, eventName, roster) {
  let raid = getRaidInfo(title);
  // let date = DateHelper.getNextDay(day);
  // if (date instanceof Error) {
  //   return date;
  // }
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
    .setTitle(`${eventName.toUpperCase()}\n${day} @ ${time}est\nTrial: ${raid['short_name']}`)
    .setDescription(`!trial join ${eventName} <role> <optional-note>`)
    .setThumbnail(logos['2']);

  // Sort by their priority (the usual postings)
  let roles = Object.keys(roster).sort((a, b) => {
    return (roster[a].priority - roster[b].priority);
  });

  roles.forEach((role) => {
    let results = '';
    let roleCount = roster[role].count;
    if (roleCount > 0) {
      let players = roster[role].players;
      if (!players) {
        for (let i = 0; i < roleCount; i++) {
          let player = '--';
          results += `${player}\n`;
        }
      } else {
        Object.keys(players).forEach((p) => {
          p = players[p];
          results += `${p.note}\n`;
        });
        let remainder = roleCount - Object.keys(players).length;
        for (let i = 0; i < remainder; i++) {
          results += '--\n';
        }
      }
      embed.addField(role.toUpperCase(), results, true);
    }
  });
  embed.addField('CP', cpDisplay, true);
  return embed;
}

function createDefinitionEmbed(term) {
  let embed = new Discord.RichEmbed()
    .setColor('#ff6600')
    .setTitle(`${term.term} - *${term.lexicalCategory}*`)
    .setThumbnail(logos['2'])
    .setDescription(`*${term.definition}*`);
  if (term.examples) {
    let count = 1;
    term.examples.forEach((e) => {
      embed.addField(`Example #${count}`, e.text);
      count++;
    });
  }
  return embed;
}

function createGeneralHelpEmbed(commands) {
  let embed = new Discord.RichEmbed()
    .setColor('#ff6600')
    .setTitle('General Commands')
    .setThumbnail(logos['2']);
  let desc = '';
  let generalCommands = Object.keys(commands.general);
  generalCommands.forEach((c) => {
    embed.addField(`**${c}** - *${commands.general[c].desc}*`, `\`!${commands.general[c].usage}\`\n`);
  });
  return embed;
}

function createSpecializedHelpEmbed(commands) {
  let embed = new Discord.RichEmbed()
    .setColor('#ff6600')
    .setTitle('Specialized Commands')
    .setThumbnail(logos['2']);
  let specializedCommands = Object.keys(commands.specialized);
  specializedCommands.forEach((c) => {
    embed.addField(`${c} - ${commands.specialized[c].desc}`, commands.specialized[c].options);
  });
  return embed;
}

function createMemeEmbed(meme) {
  let embed = new Discord.RichEmbed()
    .setColor('#ff6600')
    .setTitle(`r/${meme.subreddit}`)
    .setDescription(meme.title)
    .setImage(meme.url)
    .setURL(meme.postLink);
  return embed;
}

function createSongEmbed(song) {
  let embed = new Discord.RichEmbed()
    .setColor('#ff6600')
    .setTitle(song.name)
    .setThumbnail(song.album.images[0].url)
    .setURL(song.external_urls.spotify);
  let desc = `Artist: ${song.artists[0].name}\n`
    + `Album: ${song.album.name}\n`
    + `Track ${song.track_number} of ${song.album.total_tracks}\n`
  // embed.setDescription(desc);
  embed.addField('Artist', song.artists[0].name);
  embed.addField('Album', song.album.name);
  embed.addField('Track', `${song.track_number} of ${song.album.total_tracks}`);
  embed.addField('Length', displayUtils.millisToMinutesAndSeconds(song.duration_ms));
  return embed;
}

/**
 * Create a Discord embed for roles
 * 
 * @param {Object} - Discord's role object 
 * @param {String} - The type of role categorization 
 * @returns {Discord.RichEmbed} - Discord Embed
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

/**
 * Creates an embed for a set. If multiple sets are found, they 
 * will be shown in a list format.
 * 
 * @param {Object} set - json representing an eso set
 * 
 * @returns {Discord.RichEmbed} - Discord Embed
 */
function createSetEmbed(set) {
  let display = '';
  if (set.length > 1) {
    let embed = new Discord.RichEmbed()
      .setColor('#ff6600')
      .setTitle('Multiple sets')
      .setDescription('Try grabbing the ID instead. `!set <id>`')
      .setThumbnail(logos['2']);
    set.forEach((s) => {
      display += `[${s.id}] - [${s.name}](${s.url})\n`;
    });
    embed.addField('Sets', display);
    return embed;
  }
  if (Array.isArray(set)) {
    set = set[0];
  }
  let url = set.url;
  let traits = set.traits_needed ? ` (${set.traits_needed} traits)` : '';
  let embed = new Discord.RichEmbed()
    .setColor('#ff6600')
    .setTitle(set.name)
    .setDescription(`**ID**: ${set.id}\n**Type**: ${set.type}${traits}\n**Location**: ${set.location}`)
    .setURL(url)
    .setThumbnail(logos['2']);

  for (let i = 1; i <= 5; i++) {
    let bonus = set[`bonus_item_${i}`];
    if (bonus) {
      let items = 'items';
      if (i === 1) {
        items = 'item';
      }
      embed.addField(`(${i} ${items}):`, set[`bonus_item_${i}`]);
    }
  }
  return embed;
}

/**
 * Creates an embed for a set. If multiple sets are found, they 
 * will be shown in a list format.
 * 
 * @param {Object} set - json representing an eso set
 * 
 * @returns {Discord.RichEmbed} - Discord Embed
 */
function createSkillEmbed(skill) {
  let display = '';
  if (skill.length > 1) {
    let embed = new Discord.RichEmbed()
      .setColor('#ff6600')
      .setTitle('Multiple skills')
      .setDescription('Try grabbing the ID instead. `!skill <id>`')
      .setThumbnail(logos['2']);
    skill.forEach((s) => {
      display += `[${s.id}] - [${s.name}](${s.url})\n`;
    });
    embed.addField('Skills', display);
    return embed;
  }
  if (Array.isArray(skill)) {
    skill = skill[0];
  }
  let url = skill.url;
  let cost = skill.cost !== 'Nothing' ? `**Cost**: ${skill.cost}\n` : '';
  let embed = new Discord.RichEmbed()
    .setColor('#ff6600')
    .setTitle(skill.name)
    .setURL(url)
    .setThumbnail(skill.iconUrl)
    .setDescription(`**ID**: ${skill.id}\n**Type**: ${skill.typeString} Ability\n${cost}`);
  embed.addField('Effect', skill.effect_1);
  return embed;
}

/**
 * Creates an embed for pledges
 * 
 * @returns {Discord.RichEmbed} - Discord Embed
 */
function createPledgesEmbed(pledges) {
  if (!pledges) {
    return '';
  }
  let embed = new Discord.RichEmbed()
      .setColor('#ff6600')
      .setTitle(`Pledges - ${new Date().toDateString().substring(0, 10)}`)
      .setThumbnail(logos['2'])
      .addField('Maj', pledges['1'])
      .addField('Glirion', pledges['2'])
      .addField('Urgalarg', pledges['3']);
  return embed;
}

module.exports = {
  getRaidInfo,
  createRoster,
  createEmbed,
  createRoleEmbed,
  createSetEmbed,
  createSkillEmbed,
  createPledgesEmbed,
  createGeneralHelpEmbed,
  createSpecializedHelpEmbed,
  createDefinitionEmbed,
  createMemeEmbed,
  createSongEmbed
}