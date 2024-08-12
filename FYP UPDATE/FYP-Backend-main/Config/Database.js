const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  atabaseURL: "https://fyp-project-90196.firebaseio.com"
});

const db = admin.firestore();

module.exports = db;
