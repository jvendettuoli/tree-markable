/**
 * rootReducer which combines reducers from 
 * trees, groups, users, and comments.
 */

import { combineReducers } from 'redux';
import trees from './trees';
import auth from './auth';
import users from './users';
const root = combineReducers({
	auth,
	users,
	trees
});
export default root;
