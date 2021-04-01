/**
 * treeReducer with cases for reseting data and loading a tree.
 */

import {
	LOAD_TREE,
	LOAD_TREES,
	REMOVE_TREE,
	TREE_ERROR,
	RESET_ALL,
	TREE_REQUEST_START,
	TREE_REQUEST_SUCCESS,
	TREE_REQUEST_FAILURE
} from '../actions/types';

const INITIAL_STATE = { entities: {}, status: 'idle', error: null };

function trees(state = INITIAL_STATE, action) {
	switch (action.type) {
		case RESET_ALL:
			return { ...INITIAL_STATE };

		case TREE_REQUEST_START:
			return { ...state, status: 'loading' };

		case TREE_REQUEST_SUCCESS:
			return { ...state, status: 'idle' };

		case TREE_REQUEST_FAILURE:
			return { ...state, status: 'failure' };

		case LOAD_TREE:
			console.log('REDUCERS LOAD_TREE - action', action);
			return {
				...state,
				entities : {
					...state.entities,
					[action.payload.id]: { ...action.payload }
				},
				status   : 'success',
				error    : null
			};

		case LOAD_TREES:
			console.log('REDUCERS LOAD_TREES - action', action);
			const entitiesObj = action.payload.reduce((obj, tree) => {
				obj[tree.id] = tree;
				return obj;
			}, {});

			return { entities: entitiesObj, status: 'success', error: null };

		case REMOVE_TREE:
			console.log('REDUCERS REMOVE_TREE - action', action);
			const { [action.payload]: omit, ...trees } = state.entities;

			return { ...state, entities: trees, status: 'success', error: null };

		case TREE_ERROR:
			console.log('REDUCERS TREE_ERROR - action', action);

			return { ...state, error: action.payload };

		default:
			return state;
	}
}

export default trees;
