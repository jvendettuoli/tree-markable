/**
 * treeReducer with cases for reseting data and loading a tree.
 */

import {
	LOAD_TREE,
	LOAD_TREES,
	TREE_ERROR,
	RESET_ALL
} from '../actions/types';

const INITIAL_STATE = { trees: {}, error: null };

function trees(state = INITIAL_STATE, action) {
	switch (action.type) {
		case RESET_ALL:
			return { ...INITIAL_STATE };

		case LOAD_TREE:
			console.log('REDUCERS LOAD_TREE - action', action);
			return {
				...state,
				trees : {
					...state.trees,
					[action.payload.id]: { ...action.payload }
				},
				error : null
			};
		case LOAD_TREES:
			console.log('REDUCERS LOAD_TREES - action', action);
			const treesObj = action.payload.reduce((obj, tree) => {
				obj[tree.id] = tree;
				return obj;
			}, {});

			return { trees: treesObj, error: null };
		case TREE_ERROR:
			console.log('REDUCERS TREE_ERROR - action', action);

			return { ...state, error: action.payload };

		default:
			return state;
	}
}

export default trees;
