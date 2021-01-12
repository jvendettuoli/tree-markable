/**
 * rootReducer which combines reducers from 
 * trees, groups, users, and comments.
 */

import { combineReducers } from 'redux';
import trees from './trees';
import auth from './auth';
import currUser from './currUser';
const root = combineReducers({
	auth,
	currUser,
	trees
});
export default root;
