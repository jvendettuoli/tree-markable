/**
 * Action creator for fetching a group from the TreeMarkable API by the group id.
 * Returns an object with the returned group data.
 */

import { deleteImagesFromFirebase, groupsRef, uploadImagesToFirebase } from '../firebase/firebaseStorage';
import TreeMarkableApi from '../TreeMarkableApi';
import {
	GROUP_ERROR,
	GROUP_REQUEST_FAILURE,
	GROUP_REQUEST_START,
	GROUP_REQUEST_SUCCESS,
	LOAD_GROUP,
	LOAD_GROUPS,
	LOAD_TREE_TO_GROUP,
	REMOVE_GROUP,
	REMOVE_MEMBER_FROM_GROUP,
	REMOVE_TREE_FROM_GROUP
} from './types';

function createGroup(group, imageFiles) {
	console.log('Actions - createGroup group', group);

	return async function(dispatch) {
		dispatch({ type: GROUP_REQUEST_START });
		try {
			const res = await TreeMarkableApi.createGroup(group);
			await uploadImagesToFirebase(groupsRef, res.id, imageFiles);
			dispatch(gotGroup(res));
			dispatch({ type: GROUP_REQUEST_SUCCESS });
			return res.id;
		} catch (err) {
			console.log('Actions - createGroup err', err);
			dispatch(groupError(err));
			dispatch({ type: GROUP_REQUEST_FAILURE });
			return false;
		}
	};
}

function getGroup(id) {
	console.log('Actions - getGroup group', id);
	return async function(dispatch) {
		dispatch({ type: GROUP_REQUEST_START });
		try {
			const res = await TreeMarkableApi.getGroup(id);
			dispatch(gotGroup(res));
			dispatch({ type: GROUP_REQUEST_SUCCESS });
		} catch (err) {
			console.log('Actions - getGroup err', err);
			dispatch(groupError(err));
			dispatch({ type: GROUP_REQUEST_FAILURE });
		}
	};
}
function getGroups(searchParams) {
	return async function(dispatch) {
		dispatch({ type: GROUP_REQUEST_START });
		try {
			const res = await TreeMarkableApi.getGroups(searchParams);
			console.log('Actions - getGroups res', res);

			dispatch(gotGroups(res));
			dispatch({ type: GROUP_REQUEST_SUCCESS });
		} catch (err) {
			console.log('Actions - getGroups err', err);
			dispatch(groupError(err));
			dispatch({ type: GROUP_REQUEST_FAILURE });
		}
	};
}

function updateGroup(groupId, data) {
	return async function(dispatch) {
		dispatch({ type: GROUP_REQUEST_START });
		try {
			const res = await TreeMarkableApi.updateGroup(groupId, data);
			console.log('Actions - updateGroup res', res);
			dispatch(gotGroup(res));
			dispatch({ type: GROUP_REQUEST_SUCCESS });
			return true;
		} catch (err) {
			console.log('Actions - updateGroup err', err);
			dispatch(groupError(err));
			dispatch({ type: GROUP_REQUEST_FAILURE });
			return false;
		}
	};
}

function deleteGroup(groupId) {
	console.log('Actions - deleteGroup - start', groupId);
	return async function(dispatch) {
		dispatch({ type: GROUP_REQUEST_START });
		try {
			const res = await TreeMarkableApi.deleteGroup(groupId);
			await deleteImagesFromFirebase(groupsRef, groupId);
			console.log('Actions - deleteGroup res', res);
			dispatch(deletedGroup(groupId));
			dispatch({ type: GROUP_REQUEST_SUCCESS });
			return true;
		} catch (err) {
			console.log('Actions - deleteGroup err', err);
			dispatch(groupError(err));
			dispatch({ type: GROUP_REQUEST_FAILURE });
			return false;
		}
	};
}

/**
 * Action creators for updating the group's saved Trees 
 */

function addTreeToGroup(groupId, treeId) {
	console.log('Actions - addTreeToGroup - ', groupId, treeId);
	return async function(dispatch) {
		dispatch({ type: GROUP_REQUEST_START });

		try {
			await TreeMarkableApi.groupAddTree(groupId, treeId);
			dispatch(treeAddedToGroup({ groupId, treeId }));
			dispatch({ type: GROUP_REQUEST_SUCCESS });
		} catch (err) {
			console.log('Actions - addTreeToGroup error', err);
			dispatch(groupError(err));
			dispatch({ type: GROUP_REQUEST_FAILURE });
		}
	};
}
function removeTreeFromGroup(groupId, treeId) {
	console.log('Actions  - removeTreeFromGroup - ', groupId, treeId);
	return async function(dispatch) {
		dispatch({ type: GROUP_REQUEST_START });

		try {
			await TreeMarkableApi.groupRemoveTree(groupId, treeId);
			dispatch(treeRemovedFromGroup({ groupId, treeId }));
			dispatch({ type: GROUP_REQUEST_SUCCESS });
		} catch (err) {
			console.log('Actions - removeTreeFromGroup error', err);
			dispatch(groupError(err));
			dispatch({ type: GROUP_REQUEST_FAILURE });
		}
	};
}

/**
 * Action creators for updating the group's members 
 */

function removeMemberFromGroup(groupId, userId) {
	console.log('currUser - removeFromFollowedGroups - ', userId, groupId);
	return async function(dispatch) {
		dispatch({ type: GROUP_REQUEST_START });
		try {
			await TreeMarkableApi.userRemoveGroup(userId, groupId);
			dispatch(memberRemovedFromGroup({ groupId, userId }));
			dispatch({ type: GROUP_REQUEST_SUCCESS });
		} catch (err) {
			console.log('removeFromFollowedGroups error', err);
			dispatch(groupError(err));
			dispatch({ type: GROUP_REQUEST_FAILURE });
		}
	};
}

function addModToGroup(groupId, userId) {
	console.log('Actions - addModToGroup - ', groupId, userId);
	return async function(dispatch) {
		dispatch({ type: GROUP_REQUEST_START });

		try {
			await TreeMarkableApi.groupAddMod(groupId, userId);
			dispatch({ type: GROUP_REQUEST_SUCCESS });
		} catch (err) {
			console.log('Actions - addModToGroup error', err);
			dispatch(groupError(err));
			dispatch({ type: GROUP_REQUEST_FAILURE });
		}
	};
}

function removeModFromGroup(groupId, userId) {
	console.log('Actions - removeModFromGroup - ', groupId, userId);
	return async function(dispatch) {
		dispatch({ type: GROUP_REQUEST_START });

		try {
			await TreeMarkableApi.groupRemoveMod(groupId, userId);
			dispatch({ type: GROUP_REQUEST_SUCCESS });
		} catch (err) {
			console.log('Actions - removeModFromGroup error', err);
			dispatch(groupError(err));
			dispatch({ type: GROUP_REQUEST_FAILURE });
		}
	};
}

function gotGroup(group) {
	return { type: LOAD_GROUP, payload: group };
}
function deletedGroup(groupId) {
	return { type: REMOVE_GROUP, payload: groupId };
}
function gotGroups(groups) {
	return { type: LOAD_GROUPS, payload: groups };
}
function treeAddedToGroup(data) {
	return { type: LOAD_TREE_TO_GROUP, payload: data };
}
function treeRemovedFromGroup(data) {
	return { type: REMOVE_TREE_FROM_GROUP, payload: data };
}
function memberRemovedFromGroup(data) {
	return { type: REMOVE_MEMBER_FROM_GROUP, payload: data };
}
function groupError(error) {
	return { type: GROUP_ERROR, payload: error };
}

export {
	createGroup,
	getGroup,
	getGroups,
	updateGroup,
	addTreeToGroup,
	removeTreeFromGroup,
	addModToGroup,
	removeModFromGroup,
	removeMemberFromGroup,
	deleteGroup
};
