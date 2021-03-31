import TreeMarkableApi from '../TreeMarkableApi';
import { signUp, signIn, signOut, anonymousAuth, updateEmail, reauthenticate } from '../firebase/firebaseAuth';
import {
	LOAD_CURR_USER,
	LOAD_CURR_USER_REQUEST,
	LOAD_CURR_USER_SUCCESS,
	LOAD_CURR_USER_FAILURE,
	LOAD_CURR_USER_ERROR,
	LOAD_SAVED_TREE,
	REMOVE_SAVED_TREE,
	LOAD_FOLLOWED_GROUP,
	REMOVE_FOLLOWED_GROUP
} from './types';

/**
 * Action creator for editing the current user.
 */

function editCurrUser(credentials, username, data) {
	console.log('currUser - editCurrUser - ', credentials, username, data);
	return async function(dispatch) {
		dispatch({ type: LOAD_CURR_USER_REQUEST });
		try {
			await reauthenticate(credentials);
			// await updateEmail(data.email);

			const user = await TreeMarkableApi.updateUser(username, data);
			if (data.email) {
				await reauthenticate({
					email    : data.email,
					password : credentials.password
				});
			}
			dispatch(loadCurrUser(user));
			dispatch({ type: LOAD_CURR_USER_SUCCESS });
		} catch (err) {
			console.log('editCurrUser error', err);
			dispatch(currUserError(err));
			dispatch({ type: LOAD_CURR_USER_FAILURE });
		}
	};
}

// function updateUser(credentials, username, newEmail) {
// 	console.log('Auth - updateUserEmail');
// 	return async function(dispatch) {
// 		try {
// 			const res = await updateEmail(credentials, newEmail);
// 			console.log('res');
// 		} catch (err) {
// 			console.log('Auth - updateUserEmail - err', err);
// 			dispatch(authError(err));
// 		}
// 	};
// }

/**
 * Action creators for updating the current User's saved Trees and 
 */

function addToSavedTrees(username, treeId) {
	console.log('currUser - addToSavedTrees - ', username, treeId);
	return async function(dispatch) {
		dispatch({ type: LOAD_CURR_USER_REQUEST });
		try {
			await TreeMarkableApi.userAddTree(username, treeId);
			dispatch(treeSaved(treeId));
			dispatch({ type: LOAD_CURR_USER_SUCCESS });
		} catch (err) {
			console.log('addToSavedTrees error', err);
			dispatch(currUserError(err));
			dispatch({ type: LOAD_CURR_USER_FAILURE });
		}
	};
}
function removeFromSavedTrees(username, treeId) {
	console.log('currUser - removeFromSavedTrees - ', username, treeId);
	return async function(dispatch) {
		dispatch({ type: LOAD_CURR_USER_REQUEST });
		try {
			await TreeMarkableApi.userRemoveTree(username, treeId);
			dispatch(treeRemoved(treeId));
			dispatch({ type: LOAD_CURR_USER_SUCCESS });
		} catch (err) {
			console.log('removeFromSavedTrees error', err);
			dispatch(currUserError(err));
			dispatch({ type: LOAD_CURR_USER_FAILURE });
		}
	};
}
/**
 * Action creators for updating the current User's followed Groups
 */

function addToFollowedGroups(userId, groupId, isModerator) {
	console.log('currUser - addToFollowedGroups - ', userId, groupId, isModerator);
	return async function(dispatch) {
		dispatch({ type: LOAD_CURR_USER_REQUEST });
		try {
			await TreeMarkableApi.userAddGroup(userId, groupId, isModerator);
			dispatch(groupFollowed(groupId));
			dispatch({ type: LOAD_CURR_USER_SUCCESS });
		} catch (err) {
			console.log('addToFollowedGroups error', err);
			dispatch(currUserError(err));
			dispatch({ type: LOAD_CURR_USER_FAILURE });
		}
	};
}
function removeFromFollowedGroups(userId, groupId) {
	console.log('currUser - removeFromFollowedGroups - ', userId, groupId);
	return async function(dispatch) {
		dispatch({ type: LOAD_CURR_USER_REQUEST });
		try {
			await TreeMarkableApi.userRemoveGroup(userId, groupId);
			dispatch(groupUnfollowed(groupId));
			dispatch({ type: LOAD_CURR_USER_SUCCESS });
		} catch (err) {
			console.log('removeFromFollowedGroups error', err);
			dispatch(currUserError(err));
			dispatch({ type: LOAD_CURR_USER_FAILURE });
		}
	};
}

function loadCurrUser(user) {
	return { type: LOAD_CURR_USER, payload: user };
}
function currUserError(error) {
	return { type: LOAD_CURR_USER_ERROR, payload: error };
}
function treeSaved(treeId) {
	return { type: LOAD_SAVED_TREE, payload: treeId };
}
function treeRemoved(treeId) {
	return { type: REMOVE_SAVED_TREE, payload: treeId };
}
function groupFollowed(groupId) {
	return { type: LOAD_FOLLOWED_GROUP, payload: groupId };
}
function groupUnfollowed(groupId) {
	return { type: REMOVE_FOLLOWED_GROUP, payload: groupId };
}

export { addToSavedTrees, removeFromSavedTrees, editCurrUser, addToFollowedGroups, removeFromFollowedGroups };
