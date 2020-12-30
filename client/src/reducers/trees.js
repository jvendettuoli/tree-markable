/**
 * treeReducer with cases for reseting data and loading a tree.
 */

import { LOAD_TREE, LOAD_TREES, RESET_ALL } from '../actions/types';

const INITIAL_STATE = [];

function trees(state = INITIAL_STATE, action) {
	switch (action.type) {
		case RESET_ALL:
			return { ...INITIAL_STATE };

		case LOAD_TREE:
			console.log('REDUCERS LOAD_TREE - action', action);
			return {
				...state,
				[action.payload.id]: { ...action.payload }
			};
		case LOAD_TREES:
			console.log('REDUCERS LOAD_TREES - action', action);
			const treesObj = action.payload.reduce((obj, tree) => {
				obj[tree.id] = tree;
				return obj;
			}, {});

			return treesObj;

		default:
			return state;
	}
}

export default trees;
