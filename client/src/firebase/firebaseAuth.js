import { auth } from './firebaseIndex';

const signUp = async (email, password) => {
	console.log('firebaseAuth signUp');
	const res = await auth.createUserWithEmailAndPassword(email, password);
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

const anonymousAuth = async () => {
	console.log('firebaseAuth anonymousAuth');
	const res = await auth.signInAnonymously();
	console.log(res);
	return res;
};

/** Get Firebase token from currentUser if not null,
 * otherwise get from localStorage 
 * 
 */
const getToken = async () => {
	if (auth.currentUser !== null) {
		const token = await auth.currentUser.getIdToken(true);
		console.log('token', token);
		return token;
	}
	return;
};

export { signUp, signIn, signOut, getToken, anonymousAuth };
