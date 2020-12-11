import { auth } from './firebaseIndex';

auth.onAuthStateChanged((user) => {
	if (user) {
		console.log('USER STATE CHANGE', user);
		console.log(user.uid);
	}
	else {
		console.log('Else');
	}
});

const signUp = async (email, password) => {
	try {
		const user = await auth.createUserWithEmailAndPassword(
			email,
			password
		);
		console.log('signup successful');
		console.log(user);
	} catch (error) {
		const errorCode = error.errorCode;
		const errorMessage = error.message;
		console.log('Signup Error', errorCode, errorMessage);
	}
};
const signIn = async (email, password) => {
	try {
		const user = await auth.signInWithEmailAndPassword(
			email,
			password
		);
		console.log('LOGIN successful', user);
	} catch (error) {
		const errorCode = error.errorCode;
		const errorMessage = error.message;
		console.log('Sign In Error', errorCode, errorMessage);
	}
};

const signOut = async () => {
	try {
		const response = await auth.signOut();
		console.log('SIGNOUT', response);
	} catch (error) {
		const errorCode = error.errorCode;
		const errorMessage = error.message;
		console.log('Sign out Error', errorCode, errorMessage);
	}
};

const currentUser = () => {
	console.log(auth.currentUser);
};

const getToken = async () => {
	try {
		const token = await auth.currentUser.getIdToken(true);
		console.log('Token', token);
		return token;
	} catch (error) {
		console.log('getToken error', error.errorCode, error.message);
	}
};

export { signUp, signIn, signOut, currentUser, getToken };
