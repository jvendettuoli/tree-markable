/**
 * Action creator for fetching a tree from the TreeMarkable API by the tree id.
 * Returns an object with the returned tree data.
 */

import {
	signUp,
	signIn,
	signOut,
	anonymousAuth
} from '../firebase/firebaseAuth';
import { auth } from '../firebase/firebaseIndex';
import { AUTH_ERROR, AUTH_USER, SIGN_OUT_USER } from './types';

function signUpUser(credentials) {
	return async function(dispatch) {
		try {
			const res = await signUp(
				credentials.email,
				credentials.password
			);
			dispatch(authUser(res.user));
		} catch (err) {
			console.log('signUpUser error', err);
			dispatch(authError(err));
		}
	};
}
function signInUser(credentials) {
	return async function(dispatch) {
		try {
			console.log('SignInUser');
			const res = await signIn(
				credentials.email,
				credentials.password
			);
			dispatch(authUser(res.user));
		} catch (err) {
			console.log('signInUser error', err);
			dispatch(authError(err));
		}
	};
}

function signOutUser() {
	return async function(dispatch) {
		try {
			await signOut();
			dispatch({ type: SIGN_OUT_USER });
		} catch (err) {
			console.log('signOutUser error', err);
			dispatch(authError(err));
		}
	};
}

function signInAnonUser() {
	return async function(dispatch) {
		try {
			const res = await anonymousAuth();
			dispatch(authUser(res.user));
		} catch (err) {
			console.log('anonAuth error', err);
			dispatch(authError(err));
		}
	};
}

function verifyAuth() {
	return function(dispatch) {
		try {
			const unsubscribe = auth.onAuthStateChanged((user) => {
				if (user) {
					console.log('verifyAuth - user', user);
					dispatch(authUser(user));
				}
				else {
					console.log('verifyAuth - no user');
					dispatch(signOutUser());
				}
			});
			return unsubscribe;
		} catch (err) {
			console.log('verifyAuth error', err);
			dispatch(authError(err));
		}
	};
}

function authUser(user) {
	return { type: AUTH_USER, payload: user };
}
function authError(error) {
	return { type: AUTH_ERROR, payload: error };
}

export { signUpUser, signInUser, signOutUser, signInAnonUser, verifyAuth };
