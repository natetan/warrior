const db = require('./db').getInstance();
const displayUtils = require('../utils/displayUtils');

/**
 * 
 * @param {string} id - Guild ID
 * @returns {boolean}
 */
const exists = async id => {
  try {
    let ref = db.ref(`guilds/${id}`);
    return await ref.once('value').then((snapshot) => {
      return snapshot.exists();
    });
  } catch (err) {
    console.log(`Firebase error on guildExists(${id}, ${player}): ${err}`);
    return false;
  }
}

/**
 * 
 * @param {object} guild - Discord guild
 * @param {string} name - Discord guild name
 * @param {object} owner - Discord Guild.Member
 */
const create = async (guild, name, owner) => {
  try {
    let guildExists = await exists(guild.id);
    if (!guildExists) {
      let ref = db.ref(`guilds/${guild.id}`);
      ref.set({
        name: name,
        id: guild.id,
        dateCreated: displayUtils.dateToShortISO(guild.createdAt),
        owner: {
          id: owner.id,
          username: owner.username,
          tag: owner.tag,
          discriminator: owner.discriminator
        },
      })
    } else {
      console.log(`Guild ${name} already exists (${guild.id})`);
    }
  } catch (err) {
    console.log(`Error trying to create guild: ${err}`);
  }
}

module.exports = {
  create
}