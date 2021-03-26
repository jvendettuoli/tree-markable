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
	LOAD_GROUP_FAILURE
} from './types';

function getGroupFromApi(id) {
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

export { getGroupFromApi, getGroupsFromApi, updateGroupInApi, addTreeToGroup, removeTreeFromGroup };
