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
    // TODO: For some reason, the once.value creates a node and makes it not empty when it should've been.
    return ref.once('value').then((snapshot) => {
      console.log(snapshot.val());
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
  } catch (err) {
    console.log(`Error trying to create guild: ${err}`);
  }
}

module.exports = {
  create
}