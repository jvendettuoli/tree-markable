/**
 * Establish and export action types for consistency across app.
 */

// Tree Action Types
export const LOAD_TREE = 'LOAD_TREE';
export const LOAD_TREES = 'LOAD_TREES';
export const TREE_ERROR = 'TREE_ERROR';
export const LOAD_TREE_REQUEST = 'LOAD_TREE_REQUEST';
export const LOAD_TREE_SUCCESS = 'LOAD_TREE_SUCCESS';
export const LOAD_TREE_FAILURE = 'LOAD_TREE_FAILURE';

// Group Action Types
export const LOAD_GROUP = 'LOAD_GROUP';
export const REMOVE_GROUP = 'REMOVE_GROUP';
export const LOAD_GROUPS = 'LOAD_GROUPS';
export const LOAD_TREE_TO_GROUP = 'LOAD_TREE_TO_GROUP';
export const REMOVE_TREE_FROM_GROUP = 'REMOVE_TREE_FROM_GROUP';
export const LOAD_MEMBER_TO_GROUP = 'LOAD_MEMBER_TO_GROUP';
export const REMOVE_MEMBER_FROM_GROUP = 'REMOVE_MEMBER_FROM_GROUP';
export const GROUP_ERROR = 'GROUP_ERROR';
export const GROUP_REQUEST_START = 'GROUP_REQUEST_START';
export const GROUP_REQUEST_SUCCESS = 'GROUP_REQUEST_SUCCESS';
export const GROUP_REQUEST_FAILURE = 'GROUP_REQUEST_FAILURE';

// Curr User Action Types
export const LOAD_CURR_USER = 'LOAD_CURR_USER';
export const LOAD_CURR_USER_ERROR = 'LOAD_CURR_USER_ERROR';
export const LOAD_USERS_ERROR = 'LOAD_USERS_ERROR';
export const LOAD_CURR_USER_REQUEST = 'LOAD_CURR_USER_REQUEST';
export const LOAD_CURR_USER_SUCCESS = 'LOAD_CURR_USER_SUCCESS';
export const LOAD_CURR_USER_FAILURE = 'LOAD_CURR_USER_FAILURE';
export const RESET_CURR_USER = 'RESET_CURR_USER';

export const LOAD_SAVED_TREE = 'LOAD_SAVED_TREE';
export const REMOVE_SAVED_TREE = 'REMOVE_SAVED_TREE';

export const LOAD_FOLLOWED_GROUP = 'LOAD_FOLLOWED_GROUP';
export const REMOVE_FOLLOWED_GROUP = 'REMOVE_FOLLOWED_GROUP';

// Auth Action Types
export const AUTH_USER = 'AUTH_USER';
export const AUTH_ERROR = 'AUTH_ERROR';
export const SIGN_OUT_USER = 'SIGN_OUT_USER';

export const RESET_ALL = 'RESET_ALL';
