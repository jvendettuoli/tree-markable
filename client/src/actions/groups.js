/**
 * Action creator for fetching a group from the TreeMarkable API by the group id.
 * Returns an object with the returned group data.
 */

import TreeMarkableApi from '../TreeMarkableApi';
import { LOAD_GROUP, LOAD_GROUPS, GROUP_ERROR } from './types';

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

function gotGroup(group) {
	return { type: LOAD_GROUP, payload: group };
}
function gotGroups(groups) {
	return { type: LOAD_GROUPS, payload: groups };
}
function groupError(error) {
	return { type: GROUP_ERROR, payload: error };
}

export { getGroupFromApi, getGroupsFromApi, updateGroupInApi };
