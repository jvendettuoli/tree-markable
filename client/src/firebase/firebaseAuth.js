import { auth, firebase } from './firebaseIndex';

const signUp = async (email, password) => {
	console.log('firebaseAuth signUp');
	const res = await auth.createUserWithEmailAndPassword(email, password);
	console.log('firebaseAuth signUp - Post');

	return res;
};

const signIn = async (email, password) => {
	console.log('firebaseAuth signIn');
	const res = await auth.signInWithEmailAndPassword(email, password);
	return res;
};

const signOut = async () => {
	console.log('firebaseAuth signOut');
	await auth.signOut();
};

const updateEmail = async (email) => {
	console.log('firebaseAuth updateEmail');
	const user = auth.currentUser;
	if (user) {
		const res = await user.updateEmail(email);
		return res;
	}
};
const updateProfile = async (profileData) => {
	console.log('firebaseAuth updateProfile', profileData);
	const user = auth.currentUser;
	if (user) {
		const res = await user.updateProfile(profileData);
		return res;
	}
};

const reauthenticate = async (credentials) => {
	console.log('firebaseAuth reauthenticate - credentials', credentials);
	const user = auth.currentUser;
	console.log('firebaseAuth reauthenticate - user', user);

	if (user) {
		const credential = await firebase.auth.EmailAuthProvider.credential(
			credentials.email || user.email,
			credentials.password
		);
		await user.reauthenticateWithCredential(credential);
	}
};

const anonymousAuth = async () => {
	console.log('firebaseAuth anonymousAuth');
	const res = await auth.signInAnonymously();
	console.log(res);
	return res;
};

/** Get Firebase token from currentUser if not null,
 * otherwise returns undefined
 * 
 */
const getToken = async () => {
	if (auth.currentUser !== null) {
		const token = await auth.currentUser.getIdToken(true);
		return token;
	}
	return;
};

export {
	signUp,
	signIn,
	signOut,
	getToken,
	anonymousAuth,
	updateEmail,
	updateProfile,
	reauthenticate
};
