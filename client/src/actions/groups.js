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
	GROUP_ERROR
} from './types';

function getGroupFromApi(id) {
	return async function(dispatch) {
		try {
			const res = await TreeMarkableApi.getGroup(id);

			dispatch(gotGroup(res));
		} catch (err) {
			console.log('getGroupFromApi err', err);
			dispatch(groupError(err));
		}
	};
}
function getGroupsFromApi(searchParams) {
	return async function(dispatch) {
		try {
			const res = await TreeMarkableApi.getGroups(searchParams);
			console.log('Actions - getGroupsFromApi res', res);
			dispatch(gotGroups(res));
		} catch (err) {
			console.log('getGroupsFromApi err', err);
			dispatch(groupError(err));
		}
	};
}
function updateGroupInApi(groupId, data) {
	return async function(dispatch) {
		try {
			const res = await TreeMarkableApi.updateGroup(groupId, data);
			console.log('Actions - updateGroupInApi res', res);
			dispatch(gotGroup(res));
		} catch (err) {
			console.log('updateGroupFromApi err', err);
			dispatch(groupError(err));
		}
	};
}

/**
 * Action creators for updating the group's saved Trees 
 */

function addTreeToGroup(groupId, treeId) {
	console.log('group - addTreeToGroup - ', groupId, treeId);
	return async function(dispatch) {
		try {
			await TreeMarkableApi.groupAddTree(groupId, treeId);
			dispatch(treeAddedToGroup({ groupId, treeId }));
		} catch (err) {
			console.log('addTreeToGroup error', err);
			dispatch(groupError(err));
		}
	};
}
function removeTreeFromGroup(groupId, treeId) {
	console.log('group - removeTreeFromGroup - ', groupId, treeId);
	return async function(dispatch) {
		try {
			await TreeMarkableApi.groupRemoveTree(groupId, treeId);
			dispatch(treeRemovedFromGroup({ groupId, treeId }));
		} catch (err) {
			console.log('removeTreeFromGroup error', err);
			dispatch(groupError(err));
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
function groupError(error) {
	return { type: GROUP_ERROR, payload: error };
}

export {
	getGroupFromApi,
	getGroupsFromApi,
	updateGroupInApi,
	addTreeToGroup,
	removeTreeFromGroup
};
