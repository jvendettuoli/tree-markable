import TreeMarkableApi from '../TreeMarkableApi';
import {
	LOAD_SAVED_TREE,
	LOAD_USERS_ERROR,
	LOAD_CURR_USER_ERROR,
	REMOVE_SAVED_TREE
} from './types';

/**
 * Action creators for updating the current User's saved Trees and 
 * followed Groups
 */

function addToSavedTrees(username, treeId) {
	console.log('Users - addToSavedTrees - ', username, treeId);
	return async function(dispatch) {
		try {
			await TreeMarkableApi.userAddTree(username, treeId);
			dispatch(treeSaved(treeId));
		} catch (err) {
			console.log('addToSavedTrees error', err);
			dispatch(currUserError(err));
		}
	};
}
function removeFromSavedTrees(username, treeId) {
	console.log('Users - removeFromSavedTrees - ', username, treeId);
	return async function(dispatch) {
		try {
			await TreeMarkableApi.userRemoveTree(username, treeId);
			dispatch(treeRemoved(treeId));
		} catch (err) {
			console.log('removeFromSavedTrees error', err);
			dispatch(currUserError(err));
		}
	};
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

export { addToSavedTrees, removeFromSavedTrees };
