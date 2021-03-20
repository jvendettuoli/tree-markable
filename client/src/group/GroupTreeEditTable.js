import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import TreeList from '../tree/TreeList';
import { getTreeFromApi } from '../actions/trees';

function GroupTreeEditTable({ group, groupTrees }) {
	const dispatch = useDispatch();

	const currUserFavTreeIds = useSelector(
		(st) => st.currUser.savedTreeIds
	);

	// Get any trees that are already in store
	let userFavTrees = useSelector((st) =>
		currUserFavTreeIds.map((id) => st.trees.trees[id])
	);

	// Get array of any tree ids that were not already in store
	const remainingSelectionTreeIds = currUserFavTreeIds.filter(
		(id) => !userFavTrees.map((tree) => tree.id).includes(id)
	);
	console.log('GroupTreeEditTable userFavTrees', userFavTrees);
	console.log(
		'GroupTreeEditTable remainingSelectionTrees',
		remainingSelectionTreeIds
	);

	// Get any other user fav or group tree that is not in store from API
	useEffect(() => {
		remainingSelectionTreeIds.forEach((id) => {
			const tree = dispatch(getTreeFromApi(id));
			userFavTrees.push(tree);
		});
	}, []);
	const treesSet = new Set([ ...groupTrees, ...userFavTrees ]);
	console.log('GroupTreeEditTable treesSet', treesSet);

	return <TreeList trees={[ ...treesSet ]} group={group} />;
}
export default GroupTreeEditTable;
