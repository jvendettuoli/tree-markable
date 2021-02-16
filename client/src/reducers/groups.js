/**
 * groupReducer with cases for reseting data and loading a group.
 */

import {
	LOAD_GROUP,
	LOAD_GROUPS,
	LOAD_TREE_TO_GROUP,
	REMOVE_TREE_FROM_GROUP,
	GROUP_ERROR,
	RESET_ALL
} from '../actions/types';

const INITIAL_STATE = { groups: {}, error: null };

function groups(state = INITIAL_STATE, action) {
	switch (action.type) {
		case RESET_ALL:
			return { ...INITIAL_STATE };

		case LOAD_GROUP:
			console.log('REDUCERS LOAD_GROUP - action', action);
			return {
				...state,
				groups : {
					...state.groups,
					[action.payload.id]: { ...action.payload }
				},
				error  : null
			};
		case LOAD_GROUPS:
			console.log('REDUCERS LOAD_GROUPS - action', action);
			const groupsObj = action.payload.reduce((obj, group) => {
				obj[group.id] = group;
				return obj;
			}, {});
			return { groups: groupsObj, error: null };

		case LOAD_TREE_TO_GROUP:
			console.log('REDUCERS LOAD_TREE_TO_GROUP - action', action);
			return {
				...state,
				groups : {
					...state.groups,
					[action.payload.groupId]: {
						...state.groups[action.payload.groupId],
						trees : [
							...state.groups[action.payload.groupId].trees,
							action.payload.treeId
						]
					}
				}
			};

		case REMOVE_TREE_FROM_GROUP:
			console.log(
				'REDUCERS REMOVE_TREE_FROM_GROUP - action',
				action
			);

			return {
				...state,
				groups : {
					...state.groups,
					[action.payload.groupId]: {
						...state.groups[action.payload.groupId],
						trees : [
							...state.groups[
								action.payload.groupId
							].trees.filter(
								(treeId) =>
									treeId !== action.payload.treeId
							)
						]
					}
				}
			};
		case GROUP_ERROR:
			console.log('REDUCERS GROUP_ERROR - action', action);

			return { ...state, error: action.payload };

		default:
			return state;
	}
}

export default groups;
