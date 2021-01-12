/**
 * userReducer with cases for handling current logged in user state.
 */

import { LOAD_USER, LOAD_USER_ERROR, RESET_USER } from '../actions/types';

const INITIAL_STATE = {};

//

function user(state = INITIAL_STATE, action) {
	switch (action.type) {
		case LOAD_USER:
			console.log('Reducers LOAD_USER - action', action);

			return {
				...state,
				...action.payload,
				error : null
			};
		case LOAD_USER_ERROR:
			console.log('Reducers LOAD_USER_ERROR - action', action);

			return {
				...state,
				error : action.payload
			};
		case RESET_USER:
			console.log('Reducers RESET_USER - action', action);

			return { ...INITIAL_STATE };

		default:
			return state;
	}
}

export default user;
