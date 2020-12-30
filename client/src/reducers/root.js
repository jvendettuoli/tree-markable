/**
 * rootReducer which combines reducers from 
 * trees, groups, users, and comments.
 */

import { combineReducers } from 'redux';
import trees from './trees';
import auth from './auth';
const root = combineReducers({
	auth,
	trees
});
export default root;
