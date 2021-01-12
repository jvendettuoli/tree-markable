/**
 * authReducer with cases for handling current authenticated user state.
 */

import { AUTH_ERROR, AUTH_USER, SIGN_OUT_USER } from '../actions/types';

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
	token            : null,
	authenticated    : false,
	error            : null
};

function auth(state = INITIAL_STATE, action) {
	switch (action.type) {
		case AUTH_USER:
			console.log('Reducers AUTH_USER - action', action);

			return {
				...state,
				uid              : action.payload.firebase_id,
				username         : action.payload.username,
				email            : action.payload.email,
				token            : action.payload.token,
				img_url          : action.payload.img_url,
				created_at       : action.payload.created_at,
				home_geolocation : action.payload.home_geolocation,
				savedTreeIds     : action.payload.savedTreeIds || [],
				groupIds         : action.payload.groupIds || [],
				commentIds       : action.payload.commentIds || [],
				authenticated    : true,
				error            : null
			};
		case SIGN_OUT_USER:
			console.log('Reducers SIGN_OUT_USER - action', action);

			return {
				...state,
				...INITIAL_STATE
			};
		case AUTH_ERROR:
			console.log('Reducers AUTH_ERROR - action', action);

			return {
				...state,
				error : action.payload.message
			};
		default:
			return state;
	}
}

export default auth;
