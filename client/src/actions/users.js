/**
 * Action creator for fetching a user from the TreeMarkable API by
 *  user firebase_id. Returns an object with the returned user data.
 */

import TreeMarkableApi from '../TreeMarkableApi';
import { LOAD_USER, LOAD_USER_ERROR, RESET_USER } from './types';

function getUserFromApi(firebase_id) {
	console.log('Users - getUserFromApi - ', firebase_id);
	return async function(dispatch) {
		try {
			const res = await TreeMarkableApi.getUser(firebase_id);
			dispatch(gotUser(res));
		} catch (err) {
			console.log('getUserFromApi error', err);
			dispatch(gotUserError);
		}
	};
}

function gotUser(user) {
	return { type: LOAD_USER, payload: user };
}
function gotUserError(error) {
	return { type: LOAD_USER_ERROR, payload: error };
}
function resetUser() {
	return { type: RESET_USER };
}

export { getUserFromApi, resetUser };
