/**
 * currUserReducer with cases for handling currently logged in user state.
 */

import {
	LOAD_CURR_USER,
	LOAD_CURR_USER_ERROR,
	RESET_CURR_USER,
	LOAD_SAVED_TREE,
	REMOVE_SAVED_TREE,
	LOAD_FOLLOWED_GROUP,
	REMOVE_FOLLOWED_GROUP,
	LOAD_CURR_USER_REQUEST,
	LOAD_CURR_USER_SUCCESS,
	LOAD_CURR_USER_FAILURE
} from '../actions/types';

const INITIAL_STATE = {
	uid              : null,
	username         : null,
	email            : null,
	img_url          : null,
	created_at       : null,
	home_geolocation : [],
	savedTreeIds     : [],
	followedGroupIds : [],
	commentIds       : [],
	status           : 'idle',
	error            : null
};

function currUser(state = INITIAL_STATE, action) {
	switch (action.type) {
		case LOAD_CURR_USER_REQUEST:
			return { ...state, status: 'isLoading' };

		case LOAD_CURR_USER_SUCCESS:
			return { ...state, status: 'idle' };

		case LOAD_CURR_USER_FAILURE:
			return { ...state, status: 'failure' };

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
				followedGroupIds : action.payload.followed_group_ids || [],
				commentIds       : action.payload.commentIds || [],
				status           : 'success',
				error            : null
			};

		case LOAD_CURR_USER_ERROR:
			console.log('Reducers LOAD_CURR_USER_ERROR - action', action);
			let errors;
			if (action.payload.hasOwnProperty('code')) {
				errors = [
					{
						status  : action.payload.code,
						message : action.payload.message
					}
				];
			}
			else {
				errors = Array.isArray(action.payload) ? action.payload : [ action.payload ];
			}
			return {
				...state,
				error : errors
			};

		case RESET_CURR_USER:
			console.log('Reducers RESET_CURR_USER - action', action);
			return { ...INITIAL_STATE };

		case LOAD_SAVED_TREE:
			console.log('Reducers LOAD_SAVED_TREE - action', action);
			return {
				...state,
				status       : 'success',
				savedTreeIds : [ ...state.savedTreeIds, action.payload ]
			};

		case REMOVE_SAVED_TREE:
			console.log('Reducers REMOVE_SAVED_TREE - action', action);
			return {
				...state,
				status       : 'success',
				savedTreeIds : state.savedTreeIds.filter((treeId) => treeId !== action.payload)
			};

		case LOAD_FOLLOWED_GROUP:
			console.log('Reducers LOAD_FOLLOWED_GROUP - action', action);
			return {
				...state,
				status           : 'success',
				followedGroupIds : [ ...state.followedGroupIds, action.payload ]
			};

		case REMOVE_FOLLOWED_GROUP:
			console.log('Reducers REMOVE_FOLLOWED_GROUP - action', action);
			return {
				...state,
				status           : 'success',
				followedGroupIds : state.followedGroupIds.filter((groupId) => groupId !== action.payload)
			};

		default:
			return state;
	}
}

export default currUser;
