import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTree } from '../actions/trees';
import TreeList from '../tree/TreeList';

function GroupTreeEditTable({ group, groupTrees }) {
	console.log('GroupTreeEditTable - Start', group, groupTrees);
	const dispatch = useDispatch();

	const currUserFavTreeIds = useSelector((st) => st.currUser.savedTreeIds);

	console.log('GroupTreeEditTable - currUserFavTreeIds', currUserFavTreeIds);

	// Get any trees that are already in store
	let userFavTrees = useSelector((st) => currUserFavTreeIds.map((id) => st.trees.entities[id]));

	// Get array of any tree ids that were not already in store
	const remainingSelectionTreeIds = currUserFavTreeIds.filter(
		(id) => !userFavTrees.map((tree) => tree.id).includes(id)
	);
	// console.log('GroupTreeEditTable userFavTrees', userFavTrees);
	// console.log('GroupTreeEditTable remainingSelectionTrees', remainingSelectionTreeIds);

	// Get any other user fav or group tree that is not in store from API
	useEffect(
		() => {
			remainingSelectionTreeIds.forEach((id) => {
				const tree = dispatch(getTree(id));
				userFavTrees.push(tree);
			});
		},
		[ dispatch, userFavTrees, remainingSelectionTreeIds ]
	);
	const treesSet = new Set([ ...groupTrees, ...userFavTrees ]);
	// console.log('GroupTreeEditTable treesSet', treesSet);

	return <TreeList trees={[ ...treesSet ]} group={group} />;
}
export default GroupTreeEditTable;
