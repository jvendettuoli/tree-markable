/**
 * authReducer with cases for handling current authenticated user state.
 */

import { AUTH_ERROR, AUTH_USER, SIGN_OUT_USER } from '../actions/types';

const INITIAL_STATE = {
	uid           : null,
	token         : null,
	authenticated : false,
	error         : null
};

function auth(state = INITIAL_STATE, action) {
	switch (action.type) {
		case AUTH_USER:
			console.log('Reducers AUTH_USER - ACTION', action);

			return {
				...state,
				uid           : action.payload.uid,
				token         : action.payload.refreshToken,
				authenticated : true,
				error         : null
			};
		case SIGN_OUT_USER:
			console.log('Reducers SIGN_OUT_USER - ACTION', action);

			return {
				...state,
				uid           : null,
				token         : null,
				authenticated : false,
				error         : null
			};
		case AUTH_ERROR:
			console.log('Reducers AUTH_ERROR - ACTION', action);

			return {
				...state,
				error : action.payload.message
			};
		default:
			return state;
	}
}

export default auth;
