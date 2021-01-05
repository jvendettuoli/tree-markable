/**
 * Action creator for fetching a tree from the TreeMarkable API by the tree id.
 * Returns an object with the returned tree data.
 */

import TreeMarkableApi from '../TreeMarkableApi';
import { LOAD_TREE, LOAD_TREES } from './types';

function getTreeFromApi(id) {
	return async function(dispatch) {
		const res = await TreeMarkableApi.getTree(id);

		dispatch(gotTree(res));
	};
}
function getTreesFromApi(searchParams) {
	return async function(dispatch) {
		const res = await TreeMarkableApi.getTrees(searchParams);
		console.log('Actions - getTreesFromApi res', res);
		dispatch(gotTrees(res));
	};
}

function gotTree(tree) {
	return { type: LOAD_TREE, payload: tree };
}
function gotTrees(trees) {
	return { type: LOAD_TREES, payload: trees };
}

export { getTreeFromApi, getTreesFromApi };
