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
 * @param {String} serverName - Name of the server
 * @param {Object} players - Array of player objects
 */
async function setUpPlayers(serverName, players) {
  players.forEach((player) => {
    let ref = db.ref(`${serverName}/${String(player.name).toLowerCase()}`);
    ref.set({
      funds: player.funds,
      played: false
    })
  })
}

/**
 * Gets the player's funds from the respective guild and returns it
 * 
 * @param {Object} serverName - Name of the server
 * @param {String} player - Name of the player
 * 
 * @returns {Int}
 */
async function getPlayerFunds(serverName, player) {
  player = String(player).toLowerCase();
  let ref = db.ref(`${serverName}/${player}`);
  let funds = null;
  await ref.once('value', (snapshot) => {
    let obj = snapshot.val();
    funds = obj.funds;
  }, (err) => {
    console.log(`Failed to getPlayerFunds: ${err}`);
  });
  return funds;
}

/**
 * Updates a player's funds with the given amount and returns it
 * 
 * @param {Object} serverName - Name of the server
 * @param {String} player - Name of the player
 * @param {Int} amount - Amount of funds to add
 * 
 * @returns {Int}
 */
async function updatePlayerFunds(serverName, player, amount) {
  player = String(player).toLowerCase();
  let ref = db.ref(`${serverName}/${player}`);
  amount = Number(amount);
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
}

/**
 * Returns true if the given user exists and false otherwise
 * 
 * @param {Object} serverName - Name of the server
 * @param {String} player - Name of the player
 * 
 * @returns {boolean}
 */
async function userExists(serverName, player) {
  player = String(player).toLowerCase();
  let ref = db.ref(`${serverName}/${player}`);
  return await ref.once('value').then((snapshot) => {
    return snapshot.exists();
  });
}

module.exports = {
  setUpPlayers: setUpPlayers,
  getPlayerFunds: getPlayerFunds,
  updatePlayerFunds: updatePlayerFunds,
  userExists: userExists,
}