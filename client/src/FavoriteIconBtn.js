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

import useStyles from './styles/markerCard';

import { addToSavedTrees, removeFromSavedTrees } from './actions/currUser';

function FavoriteIconBtn({ tree }) {
	const classes = useStyles();
	const [ isFav, setIsFav ] = useState(null);
	const username = useSelector((st) => st.currUser.username);
	const savedTreeIds = useSelector((st) => st.currUser.savedTreeIds);
	const dispatch = useDispatch();

	useEffect(
		() => {
			const checkFavStatus = (treeId, savedTreeIds) => {
				setIsFav(savedTreeIds.includes(tree.id));
			};
			checkFavStatus(tree.id, savedTreeIds);
		},
		[ savedTreeIds, tree ]
	);

	const handleClick = async () => {
		if (isFav) {
			dispatch(removeFromSavedTrees(username, tree.id));
		}
		else {
			dispatch(addToSavedTrees(username, tree.id));
		}
		setIsFav(!isFav);
	};

	return (
		<Tooltip title={isFav ? 'Unfavorite' : 'Favorite'}>
			<IconButton onClick={handleClick}>
				<FavoriteIcon htmlColor={isFav ? 'red' : 'pink'} />
			</IconButton>
		</Tooltip>
	);
}
export default FavoriteIconBtn;
