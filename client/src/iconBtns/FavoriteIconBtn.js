import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { Favorite as FavoriteIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToSavedTrees, removeFromSavedTrees } from '../actions/currUser';

function FavoriteIconBtn({ treeId }) {
	const [ isFav, setIsFav ] = useState(null);
	const uid = useSelector((st) => st.currUser.uid);
	const savedTreeIds = useSelector((st) => st.currUser.savedTreeIds);
	const dispatch = useDispatch();

	useEffect(
		() => {
			const checkFavStatus = (treeId, savedTreeIds) => {
				setIsFav(savedTreeIds.includes(treeId));
			};
			checkFavStatus(treeId, savedTreeIds);
		},
		[ savedTreeIds, treeId ]
	);

	const handleClick = async () => {
		if (isFav) {
			dispatch(removeFromSavedTrees(uid, treeId));
		}
		else {
			dispatch(addToSavedTrees(uid, treeId));
		}
		setIsFav(!isFav);
	};

	if (!uid) {
		return null;
	}

	return (
		<Tooltip title={isFav ? 'Unfavorite' : 'Favorite'}>
			<IconButton onClick={handleClick}>
				<FavoriteIcon htmlColor={isFav ? 'red' : 'pink'} />
			</IconButton>
		</Tooltip>
	);
}
export default FavoriteIconBtn;
