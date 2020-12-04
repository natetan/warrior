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
  let totalCount = 0;
  let successCount = 0;
  members.forEach((member) => {
    totalCount++;
    const user = member.user;
    try {
      const ref = db.ref(`guilds/${guild.id}/members/${user.id}`);
      addToDb(ref, member);
      successCount++;
    } catch (err) {
      console.log(`Firebase error trying to setUpMembers: ${err}`);
      errorNames.push(user.name);
    }
  });
  let response = `Added ${successCount} out of ${totalCount} members to the database.`;
  response += errorNames.length > 0 ? `\n\nNames that didn't work: ${errorNames.toString()}` : '';
  return response;
}

/**
 * Returns true if the given user exists and false otherwise
 * 
 * @param {Object} guildId - Guild ID
 * @param {String} user - Name of the user
 * 
 * @returns {boolean}
 */
const exists = async (guildId, user) => {
  try {
    user = String(user).toLowerCase();
    let ref = db.ref(`guilds/${guildId}/members/${user}`);
    return await ref.once('value').then((snapshot) => {
      return snapshot.exists();
    });
  } catch (err) {
    console.log(`Firebase error on exists(${guildId}, ${user}): ${err}`);
    return false;
  }
}

/**
 * Adds a member to a given guild in the db
 * 
 * @param {*} guild 
 * @param {*} member 
 * 
 * @returns {string}
 */
const addMember = async (guild, member) => {
  try {
    const userExists = await exists(guild.id, member.id);
    if (userExists) {
      return `${member} already exists in guild ${guild.name}.`;
    }
    const ref = db.ref(`guilds/${guild.id}/members/${member.id}`);
    addToDb(ref, member);
    return `${member} added.`
  } catch (err) {
    console.log(`Firebase error on addMember(${guild.id}, ${member.user.username}): ${err}`);
    return `There was an error trying to add member.`;
  }
}

/**
 * Removes a member to a given guild in the db
 * 
 * @param {*} guild 
 * @param {*} member 
 * 
 * @returns {string}
 */
const removeMember = async (guild, member) => {
  try {
    const userExists = await exists(guild.id, member.id);
    if (!userExists) {
      return `${member} does not exist in ${guild.name} database.`;
    }
    const ref = db.ref(`guilds/${guild.id}/members/${member.id}`);
    ref.set(null);
    return `${member} removed from ${guild.name} database.`;
  } catch (err) {
    console.log(`Firebase error on addMember(${guild.id}, ${member.user.username}): ${err}`);
    return `There was an error trying to remove member.`;
  }
}

const addToDb = (ref, member) => {
  const user = member.user;
  ref.set({
    name: user.username,
    tag: user.tag,
    discriminator: user.discriminator,
    joinedAt: displayUtils.dateToShortISO(member.joinedAt),
  });
}

module.exports = {
  exists,
  setUpMembers,
  addMember,
  removeMember
}