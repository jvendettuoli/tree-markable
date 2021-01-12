/**
 * currUserReducer with cases for handling currently logged in user state.
 */

import {
	LOAD_CURR_USER,
	LOAD_CURR_USER_ERROR,
	RESET_CURR_USER,
	LOAD_SAVED_TREE,
	REMOVE_SAVED_TREE
} from '../actions/types';

const INITIAL_STATE = {
	uid              : null,
	username         : null,
	email            : null,
	img_url          : null,
	created_at       : null,
	home_geolocation : [],
	savedTreeIds     : [],
	groupIds         : [],
	commentIds       : [],
	error            : null
};

function currUser(state = INITIAL_STATE, action) {
	switch (action.type) {
		case LOAD_CURR_USER:
			console.log('Reducers LOAD_CURR_USER - action', action);

			return {
				...state,
				uid              : action.payload.firebase_id,
				is_admin         : action.payload.is_admin,
				username         : action.payload.username,
				email            : action.payload.email,
				img_url          : action.payload.img_url,
				created_at       : action.payload.created_at,
				home_geolocation : action.payload.home_geolocation,
				savedTreeIds     : action.payload.saved_tree_ids || [],
				groupIds         : action.payload.groupIds || [],
				commentIds       : action.payload.commentIds || [],
				error            : null
			};
		case LOAD_CURR_USER_ERROR:
			console.log('Reducers LOAD_CURR_USER_ERROR - action', action);

			return {
				...state,
				error : action.payload
			};
		case RESET_CURR_USER:
			console.log('Reducers RESET_CURR_USER - action', action);

			return { ...INITIAL_STATE };

		case LOAD_SAVED_TREE:
			console.log('Reducers LOAD_SAVED_TREE - action', action);

			return {
				...state,
				savedTreeIds : [ ...state.savedTreeIds, action.payload ]
			};

		case REMOVE_SAVED_TREE:
			console.log('Reducers REMOVE_SAVED_TREE - action', action);

			return {
				...state,
				savedTreeIds : state.savedTreeIds.filter(
					(treeId) => treeId !== action.payload
				)
			};

		default:
			return state;
	}
}

export default currUser;
