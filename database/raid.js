const db = require('./db').getInstance();

/**
 * 
 * @param {String} guildId -- Guild ID
 * @param {String} day -- Day of the week
 * @param {String} time -- Time
 * @param {String} trial -- Trial Name
 * @param {String} eventName -- Event Name
 */
async function createRaid(guildId, day, time, trial, eventName) {
  try {
    trial = trial.toLowerCase();
    eventName = eventName.toLowerCase();
    day = displayUtils.getNextDay(day);
    let roster = eu.createRoster(eu.getRaidInfo(trial));
    let ref = db.ref(`guilds/${guildId}/trials/${eventName}`);
    ref.set({
      day: day,
      time: time,
      trial: trial,
      name: eventName,
      roster: roster
    });
  } catch (err) {
    console.log(`Error trying to create raid: [day: ${day}, time: ${time}, trial: ${trial}, eventName: ${eventName}] - ${err}`);
  }
}

/**
 * 
 * @param {String} guildId -- Guild ID
 * @param {String} eventName -- Event name
 * @returns {Object}
 */
async function getRaid(guildId, eventName) {
  try {
    eventName = eventName.toLowerCase();
    let ref = db.ref(`guilds/${guildId}/trials/${eventName}`);
    return await ref.once('value').then((snapshot) => {
      return snapshot.val();
    })
  } catch (err) {
    console.log(`Error trying to find raid: ${err}`);
  }
}

/**
 * 
 * @param {String} guildId -- Guld ID
 * @param {String} eventName -- Event name
 * @returns {Boolean}
 */
async function raidExists(guildId, eventName) {
  try {
    eventName = eventName.toLowerCase();
    let ref = db.ref(`guilds/${guildId}/trials/${eventName}`);
    return await ref.once('value').then((snapshot) => {
      return snapshot.exists();
    });
  } catch (err) {
    console.log(`Firebase error on raidExists(${guildId}, ${player}): ${err}`);
    return false;
  }
}

/**
 * 
 * @param {String} guildId -- Guild ID
 * @param {String} eventName -- Event Name
 * @param {Object} roster -- Roster Object
 */
async function updateRaid(guildId, eventName, roster) {
  try {
    eventName = eventName.toLowerCase();
    let ref = db.ref(`guilds/${guildId}/trials/${eventName}`);
    ref.update({
      roster: roster
    })
  } catch (err) {
    console.log(`Error on updateGuild: ${err}`);
  }
}