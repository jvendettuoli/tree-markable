const admin = require('./firebaseServerAdmin');
const ExpressError = require('../helpers/expressError');

const verifyToken = async (idToken) => {
	console.log('Firebase Auth - verifyToken - Start');
	try {
		const decodedToken = await admin.auth().verifyIdToken(idToken);
		// console.log('Firebase Auth - verifyToken - decodedToken', decodedToken);
		return decodedToken;
	} catch (err) {
		return err;
	}
};

const getUserData = async (uid) => {
	console.log('Firebase Auth - getUserData - Start');
	try {
		console.log('Firebase Auth - getUserData - uid', uid);

		const userRecord = await admin.auth().getUser(uid);
		return userRecord;
	} catch (err) {
		console.log(err);
		return err;
	}
};

const createFirebaseUser = async (userData) => {
	console.log('Firebase Auth - createFirebaseUser - Start');
	try {
		const userRecord = await admin.auth().createUser(userData);
		return userRecord;
	} catch (err) {
		console.log(err);
		return err;
	}
};

const createAdmin = async (uid) => {
	console.log('Firebase Auth - createAdmin - Start');

	try {
		await admin.auth().setCustomUserClaims(uid, { is_admin: true });
		return true;
	} catch (err) {
		console.log(err);
	}
};

const updateUserInFirebase = async (uid, userData) => {
	console.log('Firebase Auth - updateUserInFirebase - Start');
	// Convert properties to Firebase recognized terms
	try {
		console.log('Userdata', userData);
		if (userData.username) {
			userData['displayName'] = userData.username;
			delete userData.username;
		}
		if (userData.img_url) {
			userData['photoURL'] = userData.img_url;
			delete userData.img_url;
		}

		// Update user in Firebase Auth
		const userRecord = await admin.auth().updateUser(uid, userData);
		return userRecord;
	} catch (err) {
		console.log(err);
		return err;
	}
};

const deleteFirebaseUser = async (uid) => {
	console.log('Firebase Auth - deleteFirebaseUser - Start');
	try {
		await admin.auth().deleteUser(uid);
		console.log(
			`User '${uid}' successfully removed from Firebause Authentication.`
		);
	} catch (err) {
		console.log(err);
		return err;
	}
};

module.exports = {
	verifyToken,
	getUserData,
	createFirebaseUser,
	createAdmin,
	updateUserInFirebase,
	deleteFirebaseUser
};
