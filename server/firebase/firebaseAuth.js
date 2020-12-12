const admin = require('./firebaseServerAdmin');
const ExpressError = require('../helpers/expressError');

const verifyToken = async (idToken) => {
	try {
		const decodedToken = await admin.auth().verifyIdToken(idToken);
		return decodedToken;
	} catch (err) {
		console.log(err);
	}
};

module.exports = { verifyToken };
