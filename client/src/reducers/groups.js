/**
 * groupReducer with cases for reseting data and loading a group.
 */

import {
	LOAD_GROUP,
	LOAD_GROUPS,
	REMOVE_GROUP,
	LOAD_TREE_TO_GROUP,
	REMOVE_TREE_FROM_GROUP,
	// LOAD_MEMBER_TO_GROUP,
	REMOVE_MEMBER_FROM_GROUP,
	GROUP_ERROR,
	GROUP_REQUEST_START,
	GROUP_REQUEST_SUCCESS,
	GROUP_REQUEST_FAILURE,
	RESET_ALL
} from '../actions/types';

const INITIAL_STATE = { entities: {}, status: 'idle', error: null };

function groups(state = INITIAL_STATE, action) {
	switch (action.type) {
		case RESET_ALL:
			console.log('REDUCERS RESET_ALL');

			return { ...INITIAL_STATE };

		case GROUP_REQUEST_START:
			console.log('REDUCERS GROUP_REQUEST_START');

			return { ...state, status: 'loading' };

		case GROUP_REQUEST_SUCCESS:
			console.log('REDUCERS GROUP_REQUEST_SUCCESS');

			return { ...state, status: 'idle' };

		case GROUP_REQUEST_FAILURE:
			console.log('REDUCERS GROUP_REQUEST_FAILURE');

			return { ...state, status: 'failure' };

		case LOAD_GROUP:
			console.log('REDUCERS LOAD_GROUP - action', action);
			return {
				...state,
				entities : {
					...state.entities,
					[action.payload.id]: { ...action.payload }
				},
				status   : 'success',
				error    : null
			};

		case LOAD_GROUPS:
			console.log('REDUCERS LOAD_GROUPS - action', action);
			const groupsObj = action.payload.reduce((obj, group) => {
				obj[group.id] = group;
				return obj;
			}, {});
			return { entities: groupsObj, status: 'success', error: null };

		case REMOVE_GROUP:
			console.log('REDUCERS REMOVE_GROUP - action', action);
			const { [action.payload]: omit, ...groups } = state.entities;
			console.log('REDUCERS REMOVE_GROUP - state.entities', state.entities);
			console.log('REDUCERS REMOVE_GROUP - groups', groups);

			return { ...state, entities: groups, status: 'success', error: null };

		case LOAD_TREE_TO_GROUP:
			console.log('REDUCERS LOAD_TREE_TO_GROUP - action', action);
			return {
				...state,
				status   : 'success',
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
				status   : 'success',
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

		/**
		 * Currently no use case for this. 
		 */
		// case LOAD_MEMBER_TO_GROUP:
		// 	console.log('REDUCERS LOAD_MEMBER_TO_GROUP - action', action);
		// 	return {
		// 		...state,
		// 		status   : 'success',
		// 		error    : null,
		// 		entities : {
		// 			...state.entities,
		// 			[action.payload.groupId]: {
		// 				...state.entities[action.payload.groupId],
		// 				members : [ ...state.entities[action.payload.groupId].members, action.payload.member ]
		// 			}
		// 		}
		// 	};

		case REMOVE_MEMBER_FROM_GROUP:
			console.log('REDUCERS REMOVE_MEMBER_FROM_GROUP - action', action);

			return {
				...state,
				status   : 'success',
				error    : null,
				entities : {
					...state.entities,
					[action.payload.groupId]: {
						...state.entities[action.payload.groupId],
						members : [
							...state.entities[action.payload.groupId].members.filter(
								(member) => member.user_id !== action.payload.userId
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
