/**
 * Establish and export action types for consistency across app.
 */

// Tree Action Types
export const LOAD_TREE = 'LOAD_TREE';
export const LOAD_TREES = 'LOAD_TREES';
export const TREE_ERROR = 'TREE_ERROR';

// Group Action Types
export const LOAD_GROUP = 'LOAD_GROUP';
export const LOAD_GROUPS = 'LOAD_GROUPS';
export const LOAD_TREE_TO_GROUP = 'LOAD_TREE_TO_GROUP';
export const REMOVE_TREE_FROM_GROUP = 'REMOVE_TREE_FROM_GROUP';
export const GROUP_ERROR = 'GROUP_ERROR';

// Curr User Action Types
export const LOAD_CURR_USER = 'LOAD_CURR_USER';
export const LOAD_CURR_USER_ERROR = 'LOAD_CURR_USER_ERROR';
export const LOAD_USERS_ERROR = 'LOAD_USERS_ERROR';
export const LOAD_SAVED_TREE = 'LOAD_SAVED_TREE';
export const REMOVE_SAVED_TREE = 'REMOVE_SAVED_TREE';
export const LOAD_FOLLOWED_GROUP = 'LOAD_FOLLOWED_GROUP';
export const REMOVE_FOLLOWED_GROUP = 'REMOVE_FOLLOWED_GROUP';
export const RESET_CURR_USER = 'RESET_CURR_USER';

// Auth Action Types
export const AUTH_USER = 'AUTH_USER';
export const AUTH_ERROR = 'AUTH_ERROR';
export const SIGN_OUT_USER = 'SIGN_OUT_USER';

export const RESET_ALL = 'RESET_ALL';
