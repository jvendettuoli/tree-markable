/**
 * groupReducer with cases for reseting data and loading a group.
 */

import {
	LOAD_GROUP,
	LOAD_GROUPS,
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
		case GROUP_ERROR:
			console.log('REDUCERS GROUP_ERROR - action', action);

			return { ...state, error: action.payload };

		default:
			return state;
	}
}

export default groups;
