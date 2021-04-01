/**
 * Action creator for fetching a tree from the TreeMarkable API by the tree id.
 * Returns an object with the returned tree data.
 */

import TreeMarkableApi from '../TreeMarkableApi';
import {
	LOAD_TREE,
	LOAD_TREES,
	REMOVE_TREE,
	TREE_ERROR,
	TREE_REQUEST_START,
	TREE_REQUEST_SUCCESS,
	TREE_REQUEST_FAILURE
} from './types';
import { treesRef, uploadImagesToFirebase, deleteImagesFromFirebase } from '../firebase/firebaseStorage';

function createTree(tree, imageFiles) {
	console.log('Actions - createTree tree', tree, imageFiles);
	return async function(dispatch) {
		dispatch({ type: TREE_REQUEST_START });
		try {
			const res = await TreeMarkableApi.createTree(tree);
			console.log('Actions - createTree res', res);
			await uploadImagesToFirebase(treesRef, res.id, imageFiles);
			dispatch(gotTree(res));
			dispatch({ type: TREE_REQUEST_SUCCESS });
			return res.id;
		} catch (err) {
			console.log('Actions - createTree err', err);
			dispatch(treeError(err));
			dispatch({ type: TREE_REQUEST_FAILURE });
			return false;
		}
	};
}

function getTree(id) {
	return async function(dispatch) {
		dispatch({ type: TREE_REQUEST_START });
		try {
			const res = await TreeMarkableApi.getTree(id);
			console.log('Actions - getTree res', res);
			dispatch(gotTree(res));
			dispatch({ type: TREE_REQUEST_SUCCESS });
		} catch (err) {
			console.log('Actions - getTree err', err);
			dispatch(treeError(err));
			dispatch({ type: TREE_REQUEST_FAILURE });
		}
	};
}
function getTrees(searchParams) {
	return async function(dispatch) {
		dispatch({ type: TREE_REQUEST_START });
		try {
			const res = await TreeMarkableApi.getTrees(searchParams);
			console.log('Actions - getTrees res', res);
			dispatch(gotTrees(res));
			dispatch({ type: TREE_REQUEST_SUCCESS });
		} catch (err) {
			console.log('Actions - getTrees err', err);
			dispatch(treeError(err));
			dispatch({ type: TREE_REQUEST_FAILURE });
		}
	};
}
function updateTree(treeId, data, imageFiles) {
	return async function(dispatch) {
		dispatch({ type: TREE_REQUEST_START });
		try {
			const res = await TreeMarkableApi.updateTree(treeId, data);
			console.log('Actions - updateTree res', res);
			if (imageFiles.length > 0) {
				console.log('Actions - updateTree - imagesFiles', imageFiles);
				await deleteImagesFromFirebase(treesRef, treeId);
				await uploadImagesToFirebase(treesRef, treeId, imageFiles);
			}
			dispatch(gotTree(res));
			dispatch({ type: TREE_REQUEST_SUCCESS });
		} catch (err) {
			console.log('Actions - updateTree err', err);
			dispatch(treeError(err));
			dispatch({ type: TREE_REQUEST_FAILURE });
		}
	};
}

function deleteTree(treeId) {
	console.log('Actions - deleteTree - start', treeId);
	return async function(dispatch) {
		dispatch({ type: TREE_REQUEST_START });
		try {
			const res = await TreeMarkableApi.deleteTree(treeId);
			console.log('Actions - deleteTree res', res);
			await deleteImagesFromFirebase(treesRef, treeId);
			await dispatch(deletedTree(treeId));
			await dispatch({ type: TREE_REQUEST_SUCCESS });
			return true;
		} catch (err) {
			console.log('Actions - deleteTree err', err);
			dispatch(treeError(err));
			dispatch({ type: TREE_REQUEST_FAILURE });
			return false;
		}
	};
}

function gotTree(tree) {
	return { type: LOAD_TREE, payload: tree };
}
function gotTrees(trees) {
	return { type: LOAD_TREES, payload: trees };
}
function deletedTree(treeId) {
	return { type: REMOVE_TREE, payload: treeId };
}
function treeError(error) {
	return { type: TREE_ERROR, payload: error };
}

export { createTree, getTree, getTrees, updateTree, deleteTree };
