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

async function setUpPlayers(serverName, players) {
  players.forEach((player) => {
    let ref = db.ref(`${serverName}/${player.name}`);
    ref.set({funds: player.funds})
  })
}

async function getPlayerFunds(serverName, player) {
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

module.exports = {
  setUpPlayers: setUpPlayers,
  getPlayerFunds: getPlayerFunds
}