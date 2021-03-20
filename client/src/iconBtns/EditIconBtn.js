import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
	Edit as EditIcon
} from '@material-ui/icons';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import useStyles from '../styles/markerCard';

function EditIconBtn({ type, id }) {
	const classes = useStyles();
	const history = useHistory();

	const handleClick = () => {
		history.push(`/${type}/${id}/edit`);
	};

	return (
		<Tooltip title={'Edit'}>
			<IconButton onClick={handleClick}>
				<EditIcon />
			</IconButton>
		</Tooltip>
	);
}
export default EditIconBtn;
