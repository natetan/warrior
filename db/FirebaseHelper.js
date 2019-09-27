const displayUtils = require('../utils/displayUtils');
const eu = require('../utils/embedUtils');

// Firebase setup
let admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.firebase_project_id ||
      require('../firebase_auth.json').project_id,
    clientEmail: process.env.firebase_client_email ||
      require('../firebase_auth.json').client_email,
    privateKey: (
      process.env.firebase_private_key ||
      require('../firebase_auth.json').private_key
    ).replace(/\\n/g, '\n')
  }),
  databaseURL: process.env.firebase_db_url || require('../firebase_auth.json').databaseURL
});

let db = admin.database();

/**
 * Adds every member of the guild into the Firebase database with starting funds.
 * Every member will have their played flag set to false
 * 
 * @param {String} serverName - Guild ID
 * @param {Object} players - Array of player objects
 */
async function setUpPlayers(guildId, players) {
  let errorNames = [];
  players.forEach((player) => {
    let formattedName = String(player.name).toLowerCase();
    try {
      let ref = db.ref(`guilds/${guildId}/members/${formattedName}`);
      ref.set({
        funds: player.funds,
        played: false
      })
    } catch (err) {
      console.log(`Firebase error trying to set up ref: ${err}`);
      errorNames.push(formattedName);
    }
  });
  return errorNames;
}

/**
 * Gets the player's funds from the respective guild and returns it
 * 
 * @param {Object} guildId - Guild ID
 * @param {String} player - Name of the player
 * 
 * @returns {Int}
 */
async function getPlayerFunds(guildId, player) {
  try {
    player = String(player).toLowerCase();
    let ref = db.ref(`guilds/${guildId}/members/${player}`);
    let funds = null;
    await ref.once('value', (snapshot) => {
      let obj = snapshot.val();
      funds = obj.funds;
    }, (err) => {
      console.log(`Failed to getPlayerFunds: ${err}`);
    });
    return funds;
  } catch (err) {
    console.log(`Firebase error on getPlayerFunds(${guildId}, ${player}): ${err}`);
    return null;
  }
}

/**
 * Updates a player's funds with the given amount and returns it
 * 
 * @param {Object} guildId - Guild ID
 * @param {String} player - Name of the player
 * @param {Int} amount - Amount of funds to add
 * 
 * @returns {Int}
 */
async function updatePlayerFunds(guildId, player, amount) {
  try {
    player = String(player).toLowerCase();
    let ref = db.ref(`guilds/${guildId}/members/${player}`);
    amount = Math.floor(Number(amount));
    let funds = null;
    await ref.once('value', (snapshot) => {
      let obj = snapshot.val();
      funds = obj.funds + amount;
      ref.update({
        funds: funds,
        played: true
      });
    });
    return funds;
  } catch (err) {
    console.log(`Firebase error on updatePlayerFunds(${guildId}, ${player}, ${amount}): ${err}`);
    return null;
  }
}

/**
 * Returns true if the given user exists and false otherwise
 * 
 * @param {Object} guildId - Guild ID
 * @param {String} player - Name of the player
 * 
 * @returns {boolean}
 */
async function userExists(guildId, player) {
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

/**
 * 
 * @param {String} guildId -- Guild ID
 * @returns {Object} -- Guild
 */
async function guildExists(guildId) {
  try {
    let ref = db.ref(`guilds/${guildId}`);
    return await ref.once('value').then((snapshot) => {
      return snapshot.exists();
    });
  } catch (err) {
    console.log(`Firebase error on guildExists(${guildId}, ${player}): ${err}`);
    return false;
  }
}

/**
 * 
 * @param {String} guildId -- Guild ID
 * @param {String} guildName -- Guild Name
 * @param {String} guildOwner -- Guild Master
 */
async function initializeGuild(guildId, guildName, guildOwner) {
  try {
    let exists = await guildExists(guildId);
    if (!exists) {
      let ref = db.ref(`guilds/${guildId}`);
      ref.set({
        name: guildName,
        owner: guildOwner
      })
    } else {
      console.log(`Guild ${guildName} already exists (${guildId})`);
    }
  } catch (err) {
    console.log(`Error trying to initialize guild: ${err}`);
  }
}

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

module.exports = {
  setUpPlayers: setUpPlayers,
  getPlayerFunds: getPlayerFunds,
  updatePlayerFunds: updatePlayerFunds,
  userExists: userExists,
  initializeGuild: initializeGuild,
  createRaid: createRaid,
  getRaid: getRaid,
  raidExists: raidExists,
  updateRaid: updateRaid,
}