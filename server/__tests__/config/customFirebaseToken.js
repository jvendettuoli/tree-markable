const admin = require('../../firebase/firebaseServerAdmin');
const axios = require('axios');
require('dotenv').config();

const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env
	.FIREBASE_WEB_API_KEY}`;

module.exports = getIdToken = async ({ uid, name }) => {
	console.log('getIdToken - Start');
	console.log('getIdToken - uid - ', uid);
	try {
		const customToken = await admin.auth().createCustomToken(uid, { name });
		console.log('getIdToken - customToken', customToken);

		const res = await axios.post(url, { token: customToken, returnSecureToken: true });
		console.log('getIdToken - res.data', res.data);
		return res.data;
	} catch (err) {
		console.error('customFirebaseToken - getIdToken -', err);
		throw err;
	}
};
