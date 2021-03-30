/**
 * Action creator for fetching a group from the TreeMarkable API by the group id.
 * Returns an object with the returned group data.
 */

import TreeMarkableApi from '../TreeMarkableApi';
import {
	LOAD_GROUP,
	LOAD_GROUPS,
	LOAD_TREE_TO_GROUP,
	REMOVE_TREE_FROM_GROUP,
	GROUP_ERROR,
	LOAD_GROUP_REQUEST,
	LOAD_GROUP_SUCCESS,
	LOAD_GROUP_FAILURE,
	REMOVE_MEMBER_FROM_GROUP
} from './types';
import { addToFollowedGroups } from './currUser';
import { groupsRef, uploadImagesToFirebase } from '../firebase/firebaseStorage';

// Sends POST request for new group to TreeMarkableApi
// Also adds user creating group as a follower and moderator for group
function createGroup(group, imageFiles, username, history) {
	console.log('Actions - createGroupInApi group', group);

	return async function(dispatch) {
		dispatch({ type: LOAD_GROUP_REQUEST });
		try {
			const res = await TreeMarkableApi.createGroup(group);
			await uploadImagesToFirebase(groupsRef, res.id, imageFiles);
			dispatch(gotGroup(res));
			dispatch(addToFollowedGroups(username, res.id, true));
			history.push(`/groups/${res.id}`);
			dispatch({ type: LOAD_GROUP_SUCCESS });
		} catch (err) {
			console.log('Actions - createGroupInApi err', err);
			dispatch(groupError(err));
			dispatch({ type: LOAD_GROUP_FAILURE });
		}
	};
}

function getGroupFromApi(id) {
	console.log('Actions - getGroupFromApi group', id);
	return async function(dispatch) {
		dispatch({ type: LOAD_GROUP_REQUEST });
		try {
			const res = await TreeMarkableApi.getGroup(id);
			dispatch(gotGroup(res));
			dispatch({ type: LOAD_GROUP_SUCCESS });
		} catch (err) {
			console.log('Actions - getGroupFromApi err', err);
			dispatch(groupError(err));
			dispatch({ type: LOAD_GROUP_FAILURE });
		}
	};
}
function getGroupsFromApi(searchParams) {
	return async function(dispatch) {
		dispatch({ type: LOAD_GROUP_REQUEST });
		try {
			const res = await TreeMarkableApi.getGroups(searchParams);
			console.log('Actions - getGroupsFromApi res', res);

			dispatch(gotGroups(res));
			dispatch({ type: LOAD_GROUP_SUCCESS });
		} catch (err) {
			console.log('Actions - getGroupsFromApi err', err);
			dispatch(groupError(err));
			dispatch({ type: LOAD_GROUP_FAILURE });
		}
	};
}
function updateGroupInApi(groupId, data) {
	return async function(dispatch) {
		dispatch({ type: LOAD_GROUP_REQUEST });
		try {
			const res = await TreeMarkableApi.updateGroup(groupId, data);
			console.log('Actions - updateGroupInApi res', res);
			dispatch(gotGroup(res));
			dispatch({ type: LOAD_GROUP_SUCCESS });
		} catch (err) {
			console.log('Actions - updateGroupFromApi err', err);
			dispatch(groupError(err));
			dispatch({ type: LOAD_GROUP_FAILURE });
		}
	};
}

/**
 * Action creators for updating the group's saved Trees 
 */

function addTreeToGroup(groupId, treeId) {
	console.log('Actions - addTreeToGroup - ', groupId, treeId);
	return async function(dispatch) {
		dispatch({ type: LOAD_GROUP_REQUEST });

		try {
			await TreeMarkableApi.groupAddTree(groupId, treeId);
			dispatch(treeAddedToGroup({ groupId, treeId }));
			dispatch({ type: LOAD_GROUP_SUCCESS });
		} catch (err) {
			console.log('Actions - addTreeToGroup error', err);
			dispatch(groupError(err));
			dispatch({ type: LOAD_GROUP_FAILURE });
		}
	};
}
function removeTreeFromGroup(groupId, treeId) {
	console.log('Actions  - removeTreeFromGroup - ', groupId, treeId);
	return async function(dispatch) {
		dispatch({ type: LOAD_GROUP_REQUEST });

		try {
			await TreeMarkableApi.groupRemoveTree(groupId, treeId);
			dispatch(treeRemovedFromGroup({ groupId, treeId }));
			dispatch({ type: LOAD_GROUP_SUCCESS });
		} catch (err) {
			console.log('Actions - removeTreeFromGroup error', err);
			dispatch(groupError(err));
			dispatch({ type: LOAD_GROUP_FAILURE });
		}
	};
}

/**
 * Action creators for updating the group's members 
 */

function removeMemberFromGroup(groupId, userId) {
	console.log('currUser - removeFromFollowedGroups - ', userId, groupId);
	return async function(dispatch) {
		dispatch({ type: LOAD_GROUP_REQUEST });
		try {
			await TreeMarkableApi.userRemoveGroup(userId, groupId);
			dispatch(memberRemovedFromGroup({ groupId, userId }));
			dispatch({ type: LOAD_GROUP_SUCCESS });
		} catch (err) {
			console.log('removeFromFollowedGroups error', err);
			dispatch(groupError(err));
			dispatch({ type: LOAD_GROUP_FAILURE });
		}
	};
}

function addModToGroup(groupId, userId) {
	console.log('Actions - addModToGroup - ', groupId, userId);
	return async function(dispatch) {
		dispatch({ type: LOAD_GROUP_REQUEST });

		try {
			await TreeMarkableApi.groupAddMod(groupId, userId);
			dispatch({ type: LOAD_GROUP_SUCCESS });
		} catch (err) {
			console.log('Actions - addModToGroup error', err);
			dispatch(groupError(err));
			dispatch({ type: LOAD_GROUP_FAILURE });
		}
	};
}

function removeModFromGroup(groupId, userId) {
	console.log('Actions - removeModFromGroup - ', groupId, userId);
	return async function(dispatch) {
		dispatch({ type: LOAD_GROUP_REQUEST });

		try {
			await TreeMarkableApi.groupRemoveMod(groupId, userId);
			dispatch({ type: LOAD_GROUP_SUCCESS });
		} catch (err) {
			console.log('Actions - removeModFromGroup error', err);
			dispatch(groupError(err));
			dispatch({ type: LOAD_GROUP_FAILURE });
		}
	};
}

function gotGroup(group) {
	return { type: LOAD_GROUP, payload: group };
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
	getGroupFromApi,
	getGroupsFromApi,
	updateGroupInApi,
	addTreeToGroup,
	removeTreeFromGroup,
	addModToGroup,
	removeModFromGroup,
	removeMemberFromGroup
};
