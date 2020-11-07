const db = require('./db').getInstance();
const displayUtils = require('../utils/displayUtils');

/**
 * Adds every member of the guild into the Firebase database
 * 
 * @param {object} guild - Guild 
 * @param {object[]} members - list of members
 */
const setUpMembers = async (guild, members) => {
  const errorNames = [];
  members.forEach((member) => {
    const user = member.user;
    try {
      const ref = db.ref(`guilds/${guild.id}/members/${user.id}`);
      ref.set({
        name: user.username,
        tag: user.tag,
        discriminator: user.discriminator,
        joinedAt: displayUtils.dateToShortISO(member.joinedAt),
      })
    } catch (err) {
      console.log(`Firebase error trying to setUpMembers: ${err}`);
      errorNames.push(user.name);
    }
  });
  return errorNames;
}

/**
 * Returns true if the given user exists and false otherwise
 * 
 * @param {Object} guildId - Guild ID
 * @param {String} player - Name of the player
 * 
 * @returns {boolean}
 */
const userExists = async (guildId, player) => {
  try {
    player = String(player).toLowerCase();
    let ref = db.ref(`guilds/${guildId}/members/${player}`);
    return await ref.once('value').then((snapshot) => {
      return snapshot.exists();
    });
  } catch (err) {
    console.log(`Firebase error on userExists(${guildId}, ${player}): ${err}`);
    return false;
  }
}

module.exports = {
  userExists,
  setUpMembers
}