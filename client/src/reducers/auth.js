/**
 * authReducer with cases for handling current authenticated user state.
 */

import { AUTH_ERROR, AUTH_USER, SIGN_OUT_USER } from '../actions/types';

const INITIAL_STATE = {
	uid           : null,
	username      : null,
	token         : null,
	authenticated : false,
	error         : null
};

function auth(state = INITIAL_STATE, action) {
	switch (action.type) {
		case AUTH_USER:
			console.log('Reducers AUTH_USER - action', action);

			return {
				...state,
				uid           : action.payload.uid,
				username      : action.payload.displayName,
				token         : action.payload.refreshToken,
				authenticated : true,
				error         : null
			};
		case SIGN_OUT_USER:
			console.log('Reducers SIGN_OUT_USER - action', action);

			return {
				...state,
				uid           : null,
				username      : null,
				token         : null,
				authenticated : false,
				error         : null
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
