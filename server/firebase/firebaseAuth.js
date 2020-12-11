const admin = require('./firebaseServerAdmin');
const ExpressError = require('../helpers/expressError');

const verifyToken = async (idToken) => {
	try {
		const decodedToken = await admin.auth().verifyIdToken(idToken);
		console.log('Decoded token', decodedToken);
	} catch (error) {
		// return new ExpressError('Issue verifying idToken', 401);
		return error;
	}
};

module.exports = { verifyToken };
