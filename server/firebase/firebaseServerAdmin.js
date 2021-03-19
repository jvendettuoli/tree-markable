const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json')
const { DB_URI } = require('../config');

admin.initializeApp({
	credential  : admin.credential.cert(serviceAccount),
	databaseURL : DB_URI
});

module.exports = admin;
