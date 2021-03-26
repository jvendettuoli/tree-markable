/**
 * treeReducer with cases for reseting data and loading a tree.
 */

import {
	LOAD_TREE,
	LOAD_TREES,
	TREE_ERROR,
	RESET_ALL,
	LOAD_TREE_REQUEST,
	LOAD_TREE_SUCCESS,
	LOAD_TREE_FAILURE
} from '../actions/types';

const INITIAL_STATE = { entities: {}, status: 'idle', error: null };

function trees(state = INITIAL_STATE, action) {
	switch (action.type) {
		case RESET_ALL:
			return { ...INITIAL_STATE };

		case LOAD_TREE_REQUEST:
			return { ...state, status: 'isLoading' };

		case LOAD_TREE_SUCCESS:
			return { ...state, status: 'success' };

		case LOAD_TREE_FAILURE:
			return { ...state, status: 'failure' };

		case LOAD_TREE:
			console.log('REDUCERS LOAD_TREE - action', action);
			return {
				...state,
				entities : {
					...state.entities,
					[action.payload.id]: { ...action.payload }
				},
				status   : 'idle',
				error    : null
			};

		case LOAD_TREES:
			console.log('REDUCERS LOAD_TREES - action', action);
			const entitiesObj = action.payload.reduce((obj, tree) => {
				obj[tree.id] = tree;
				return obj;
			}, {});

			return { entities: entitiesObj, status: 'idle', error: null };

		case TREE_ERROR:
			console.log('REDUCERS TREE_ERROR - action', action);

			return { ...state, error: action.payload };

		default:
			return state;
	}
}

export default trees;
