import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
	Info as InfoIcon,
	Add as AddIcon,
	Nature as NatureIcon,
	Group as GroupIcon,
	Explore as ExploreIcon,
	Home as HomeIcon,
	Message as MessageIcon,
	Check as CheckIcon,
	FavoriteBorder as FavoriteBorderIcon,
	Favorite as FavoriteIcon
} from '@material-ui/icons';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import useStyles from '../styles/markerCard';
import { addToSavedTrees, removeFromSavedTrees } from '../actions/currUser';

function FavoriteIconBtn({ treeId }) {
	const classes = useStyles();
	const [ isFav, setIsFav ] = useState(null);
	const username = useSelector((st) => st.currUser.username);
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
			dispatch(removeFromSavedTrees(username, treeId));
		}
		else {
			dispatch(addToSavedTrees(username, treeId));
		}
		setIsFav(!isFav);
	};

	if (!username) {
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
