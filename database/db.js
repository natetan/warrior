const displayUtils = require('../utils/displayUtils');
const eu = require('../utils/embedUtils');

// Firebase setup
const admin = require('firebase-admin');

const config = {
  credential: admin.credential.cert({
    projectId: process.env.firebase_project_id || require('../firebase_auth.json').project_id,
    clientEmail: process.env.firebase_client_email || require('../firebase_auth.json').client_email,
    privateKey: (process.env.firebase_private_key || require('../firebase_auth.json').private_key).replace(/\\n/g, '\n')
  }),
  databaseURL: process.env.firebase_db_url || require('../firebase_auth.json').databaseURL
}

admin.initializeApp(config);

const db = admin.database();

module.exports.getInstance = () => {
  return db;
}