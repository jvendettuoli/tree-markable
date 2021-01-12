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
import TreeMarkableApi from '../TreeMarkableApi';
import { auth } from '../firebase/firebaseIndex';
import { AUTH_ERROR, AUTH_USER, SIGN_OUT_USER } from './types';

function signUpUser(credentials, userData) {
	console.log('Auth - signUpUser - ', credentials, userData);
	return async function(dispatch) {
		try {
			// create user in FirebaseAuth
			const firebaseRes = await signUp(
				credentials.email,
				credentials.password
			);
			// create user in TreeMarkable Database
			const apiRes = await TreeMarkableApi.registerUser({
				...userData,
				uid : firebaseRes.user.uid
			});
			dispatch(
				authUser({
					...apiRes,
					token : firebaseRes.user.refreshToken
				})
			);
		} catch (err) {
			console.log('signUpUser error', err);
			dispatch(authError(err));
		}
	};
}
function signInUser(credentials) {
	console.log('Auth - signInUser', credentials);

	return async function(dispatch) {
		try {
			const firebaseRes = await signIn(
				credentials.email,
				credentials.password
			);

			const apiRes = await TreeMarkableApi.getUser(
				firebaseRes.user.displayName
			);
			dispatch(
				authUser({
					...apiRes,
					token : firebaseRes.user.refreshToken
				})
			);
		} catch (err) {
			console.log('signInUser error', err);
			dispatch(authError(err));
		}
	};
}

function signOutUser() {
	console.log('Auth - signOutUser');
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
			const unsubscribe = auth.onAuthStateChanged(async (user) => {
				if (user) {
					const apiRes = await TreeMarkableApi.getUser(
						user.displayName
					);

					dispatch(
						authUser({ ...apiRes, token: user.refreshToken })
					);
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
