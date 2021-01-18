/**
 * Action creator for fetching a tree from the TreeMarkable API by the tree id.
 * Returns an object with the returned tree data.
 */

import TreeMarkableApi from '../TreeMarkableApi';
import { LOAD_TREE, LOAD_TREES, TREE_ERROR } from './types';

function getTreeFromApi(id) {
	return async function(dispatch) {
		try {
			const res = await TreeMarkableApi.getTree(id);

			dispatch(gotTree(res));
		} catch (err) {
			console.log('getTreeFromApi err', err);
			dispatch(treeError(err));
		}
	};
}
function getTreesFromApi(searchParams) {
	return async function(dispatch) {
		try {
			const res = await TreeMarkableApi.getTrees(searchParams);
			console.log('Actions - getTreesFromApi res', res);
			dispatch(gotTrees(res));
		} catch (err) {
			console.log('getTreesFromApi err', err);
			dispatch(treeError(err));
		}
	};
}
function updateTreeInApi(treeId, data) {
	return async function(dispatch) {
		try {
			const res = await TreeMarkableApi.updateTree(treeId, data);
			console.log('Actions - updateTreeInApi res', res);
			dispatch(gotTree(res));
		} catch (err) {
			console.log('updateTreeFromApi err', err);
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
