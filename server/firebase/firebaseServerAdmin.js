const admin = require('firebase-admin');
const { DB_URI } = require('../config');

admin.initializeApp({
	credential  : admin.credential.applicationDefault(),
	databaseURL : DB_URI
});

module.exports = admin;
