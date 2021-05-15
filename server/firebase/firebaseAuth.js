const admin = require('./firebaseServerAdmin');

const verifyToken = async (idToken) => {
	console.log('Firebase Auth - verifyToken - Start');
	try {
		const decodedToken = await admin.auth().verifyIdToken(idToken);
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

// Sets a user to have the admin property on their token issued from Firebase
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
		console.log('Firebase Auth - updateUserInFirebase - userdata', userData);
		const firebaseReadyUserData = { ...userData };
		if (firebaseReadyUserData.username) {
			firebaseReadyUserData['displayName'] = firebaseReadyUserData.username;
			delete firebaseReadyUserData.username;
		}
		if (firebaseReadyUserData.img_url) {
			firebaseReadyUserData['photoURL'] = firebaseReadyUserData.img_url;
			delete firebaseReadyUserData.img_url;
		}
		if (firebaseReadyUserData.new_password) {
			firebaseReadyUserData['password'] = firebaseReadyUserData.new_password;
		}

		// Update user in Firebase Auth
		const userRecord = await admin.auth().updateUser(uid, firebaseReadyUserData);
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
		console.log(`User '${uid}' successfully removed from Firebase Authentication.`);
	} catch (err) {
		console.log(err);
		return err;
	}
};

/**
 * @param {Array.<Object>} users - They users data by which they will be searched in Firebase.
 * @return {Array.<Object>} results - Return data from Firebase. Can be user records or errors for why any given record was not found.
 */
const getFirebaseUsers = async (users) => {
	console.debug('Firebase Auth - getFirebaseUsers - Start');
	try {
		const results = await admin.auth().getUsers(users);
		console.debug('Firebase Auth - getFirebaseUsers - Success');
		return results;
	} catch (err) {
		console.debug('Firebase Auth - getFirebaseUsers - Error');
		console.debug(err);
	}
};

const listAllFirebaseUsers = async (nextPageToken) => {
	try {
		const users = [];
		results = await admin.auth().listUsers(1000, nextPageToken);
		users.push(...results.users);
		if (results.pageToken) {
			listAllFirebaseUsers(results.pageToken);
		}
		return users;
	} catch (err) {
		console.log(err);
		return err;
	}
};

module.exports = {
	verifyToken,
	getUserData,
	getFirebaseUsers,
	createFirebaseUser,
	createAdmin,
	updateUserInFirebase,
	deleteFirebaseUser,
	listAllFirebaseUsers
};
