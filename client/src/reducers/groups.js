/**
 * groupReducer with cases for reseting data and loading a group.
 */

import {
	LOAD_GROUP,
	LOAD_GROUPS,
	LOAD_TREE_TO_GROUP,
	REMOVE_TREE_FROM_GROUP,
	GROUP_ERROR,
	LOAD_GROUP_REQUEST,
	LOAD_GROUP_SUCCESS,
	LOAD_GROUP_FAILURE,
	RESET_ALL
} from '../actions/types';

const INITIAL_STATE = { entities: {}, status: 'idle', error: null };

function groups(state = INITIAL_STATE, action) {
	switch (action.type) {
		case RESET_ALL:
			return { ...INITIAL_STATE };

		case LOAD_GROUP_REQUEST:
			return { ...state, status: 'isLoading' };

		case LOAD_GROUP_SUCCESS:
			return { ...state, status: 'success' };

		case LOAD_GROUP_FAILURE:
			return { ...state, status: 'failure' };

		case LOAD_GROUP:
			console.log('REDUCERS LOAD_GROUP - action', action);
			return {
				...state,
				entities : {
					...state.entities,
					[action.payload.id]: { ...action.payload }
				},
				status   : 'idle',
				error    : null
			};
		case LOAD_GROUPS:
			console.log('REDUCERS LOAD_GROUPS - action', action);
			const groupsObj = action.payload.reduce((obj, group) => {
				obj[group.id] = group;
				return obj;
			}, {});
			return { entities: groupsObj, status: 'idle', error: null };

		case LOAD_TREE_TO_GROUP:
			console.log('REDUCERS LOAD_TREE_TO_GROUP - action', action);
			return {
				...state,
				status   : 'idle',
				error    : null,
				entities : {
					...state.entities,
					[action.payload.groupId]: {
						...state.entities[action.payload.groupId],
						trees : [ ...state.entities[action.payload.groupId].trees, action.payload.treeId ]
					}
				}
			};

		case REMOVE_TREE_FROM_GROUP:
			console.log('REDUCERS REMOVE_TREE_FROM_GROUP - action', action);

			return {
				...state,
				status   : 'idle',
				error    : null,
				entities : {
					...state.entities,
					[action.payload.groupId]: {
						...state.entities[action.payload.groupId],
						trees : [
							...state.entities[action.payload.groupId].trees.filter(
								(treeId) => treeId !== action.payload.treeId
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
