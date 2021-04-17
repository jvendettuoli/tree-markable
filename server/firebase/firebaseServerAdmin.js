const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKeyEnv.js');
const { DB_URI } = require('../config');

console.log('SERVICE ACCOUNT: ', serviceAccount);
console.log('DB_URI: ', DB_URI);

admin.initializeApp({
	credential : admin.credential.cert({
		project_id   : process.env.FIREBASE_PROEJCT_ID,
		private_key  : process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
		client_email : process.env.FIREBASE_CLIENT_EMAIL
	})
});

module.exports = admin;
