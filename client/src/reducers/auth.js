/**
 * authReducer with cases for handling current authenticated user state.
 */

import { AUTH_ERROR, AUTH_USER, SIGN_OUT_USER } from '../actions/types';

const INITIAL_STATE = {
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
				token         : action.payload.token,
				authenticated : true,
				error         : null
			};
		case SIGN_OUT_USER:
			console.log('Reducers SIGN_OUT_USER - action', action);
			return { ...INITIAL_STATE };
		case AUTH_ERROR:
			console.log('Reducers AUTH_ERROR - action', action);
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
				errors = Array.isArray(action.payload)
					? action.payload
					: [ action.payload ];
			}

			return {
				...state,
				error : errors
			};
		default:
			return state;
	}
}

export default auth;
