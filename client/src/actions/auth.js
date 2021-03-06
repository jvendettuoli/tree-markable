/**
 * Action creators for handling authentication of user. When user signs in
 * and is authenticated, updates store. Resets store on user sign out.
 * 
 * Also updates user store to keep current user synced with authentication.
 */

import { anonymousAuth, signIn, signOut, signUp, updateProfile } from '../firebase/firebaseAuth';
import { auth } from '../firebase/firebaseIndex';
import TreeMarkableApi from '../TreeMarkableApi';
import {
	AUTH_ERROR,
	AUTH_USER,
	LOAD_CURR_USER,
	LOAD_CURR_USER_FAILURE,
	LOAD_CURR_USER_REQUEST,
	LOAD_CURR_USER_SUCCESS,
	RESET_CURR_USER,
	SIGN_OUT_USER
} from './types';

function signUpUser(credentials, userData) {
	console.log('Auth - signUpUser - ', credentials, userData);
	return async function(dispatch) {
		dispatch({ type: LOAD_CURR_USER_REQUEST });
		try {
			// create user in FirebaseAuth
			const firebaseRes = await signUp(credentials.email, credentials.password);
			// create user in TreeMarkable Database
			const apiRes = await TreeMarkableApi.registerUser({
				...userData,
				firebase_id : firebaseRes.user.uid
			});

			await updateProfile({ displayName: apiRes.username });
			const currUserData = {
				...apiRes,
				token : firebaseRes.user.refreshToken
			};
			dispatch(
				authUser({
					token : firebaseRes.user.refreshToken
				})
			);
			dispatch(loadCurrUser(currUserData));
			dispatch({ type: LOAD_CURR_USER_SUCCESS });
		} catch (err) {
			console.log('signUpUser error', err);
			dispatch(authError(err));
			dispatch({ type: LOAD_CURR_USER_FAILURE });
		}
	};
}
function signInUser(credentials) {
	console.log('Auth - signInUser', credentials);

	return async function(dispatch) {
		dispatch({ type: LOAD_CURR_USER_REQUEST });

		try {
			const firebaseRes = await signIn(credentials.email, credentials.password);

			const apiRes = await TreeMarkableApi.getUser(firebaseRes.user.displayName);
			const currUserData = {
				...apiRes,
				token : firebaseRes.user.refreshToken
			};
			dispatch(
				authUser({
					token : firebaseRes.user.refreshToken
				})
			);
			dispatch(loadCurrUser(currUserData));
			dispatch({ type: LOAD_CURR_USER_SUCCESS });
		} catch (err) {
			console.log('signInUser error', err);
			dispatch(authError(err));
			dispatch({ type: LOAD_CURR_USER_FAILURE });
		}
	};
}

function signOutUser() {
	console.log('Auth - signOutUser');
	return async function(dispatch) {
		try {
			await signOut();
			dispatch({ type: SIGN_OUT_USER });
			dispatch({ type: RESET_CURR_USER });
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
					console.log('verifyAuth - user', user);
				}
				else {
					console.log('verifyAuth - no user');
					dispatch(signOutUser());
				}
			});
			return unsubscribe;
		} catch (err) {
			console.log('verifyAuth - error', err);
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
function loadCurrUser(user) {
	return { type: LOAD_CURR_USER, payload: user };
}

export { signUpUser, signInUser, signOutUser, signInAnonUser, verifyAuth };
