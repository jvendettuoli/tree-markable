/**
 * Action creator for fetching a tree from the TreeMarkable API by the tree id.
 * Returns an object with the returned tree data.
 */

import TreeMarkableApi from '../TreeMarkableApi';
import { LOAD_TREE, LOAD_TREES, TREE_ERROR, LOAD_TREE_REQUEST, LOAD_TREE_SUCCESS, LOAD_TREE_FAILURE } from './types';

function getTreeFromApi(id) {
	return async function(dispatch) {
		dispatch({ type: LOAD_TREE_REQUEST });
		try {
			const res = await TreeMarkableApi.getTree(id);
			dispatch({ type: LOAD_TREE_SUCCESS });
			dispatch(gotTree(res));
		} catch (err) {
			console.log('getTreeFromApi err', err);
			dispatch({ type: LOAD_TREE_FAILURE });
			dispatch(treeError(err));
		}
	};
}
function getTreesFromApi(searchParams) {
	return async function(dispatch) {
		dispatch({ type: LOAD_TREE_REQUEST });
		try {
			const res = await TreeMarkableApi.getTrees(searchParams);
			console.log('Actions - getTreesFromApi res', res);
			dispatch({ type: LOAD_TREE_SUCCESS });
			dispatch(gotTrees(res));
		} catch (err) {
			console.log('getTreesFromApi err', err);
			dispatch({ type: LOAD_TREE_FAILURE });
			dispatch(treeError(err));
		}
	};
}
function updateTreeInApi(treeId, data) {
	return async function(dispatch) {
		dispatch({ type: LOAD_TREE_REQUEST });
		try {
			const res = await TreeMarkableApi.updateTree(treeId, data);
			console.log('Actions - updateTreeInApi res', res);
			dispatch({ type: LOAD_TREE_SUCCESS });
			dispatch(gotTree(res));
		} catch (err) {
			console.log('updateTreeFromApi err', err);
			dispatch({ type: LOAD_TREE_FAILURE });
			dispatch(treeError(err));
		}
	};
}

function gotTree(tree) {
	return { type: LOAD_TREE, payload: tree };
}
function gotTrees(trees) {
	return { type: LOAD_TREES, payload: trees };
}
function treeError(error) {
	return { type: TREE_ERROR, payload: error };
}

export { getTreeFromApi, getTreesFromApi, updateTreeInApi };
