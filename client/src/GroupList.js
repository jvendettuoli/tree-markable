import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { DataGrid } from '@material-ui/data-grid';

import {
	FavoriteBorder as FavoriteBorderIcon,
	Favorite as FavoriteIcon
} from '@material-ui/icons';

import { getTreesFromApi } from './actions/trees';
import SelectLocationMap from './SelectLocationMap';
import {
	treesRef,
	uploadImagesToFirebase
} from './firebase/firebaseStorage';
import ImagesInput from './ImagesInput';
import { addToSavedTrees, removeFromSavedTrees } from './actions/currUser';

const useStyles = makeStyles((theme) => ({
	root : {
		width                     : '100%',
		backgroundColor           : theme.palette.background.paper,
		'& .data-grid-fav-header' : {
			'& .MuiDataGrid-colCellTitleContainer' : {
				alignItems : 'center'
			}
		}
	}
}));

function DetailsLinkBtn(props) {
	return (
		<Button color="primary" component={Link} {...props}>
			Show
		</Button>
	);
}

const checkTreeIdInUserFavs = (userFavTreeIds, treeId) => {
	return userFavTreeIds.includes(treeId);
};

function GroupList({ groups }) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { username, savedGroupIds } = useSelector((st) => st.currUser);
	const groupRows = groups.map((group) => ({
		...group,
		created_at : new Date(
			group.created_at
		).toLocaleDateString('en-gb', {
			year  : 'numeric',
			month : 'long',
			day   : 'numeric'
		}),
		link       : `groups/${group.id}`
	}));

	const handleUnfavoriteClick = (evt) => {
		const groupId = parseInt(evt.currentTarget.dataset.groupId);
		dispatch(removeFromSavedTrees(username, groupId));
	};
	const handleFavoriteClick = (evt) => {
		const groupId = parseInt(evt.currentTarget.dataset.groupId);
		dispatch(addToSavedTrees(username, groupId));
	};

	const columns = [
		{ field: 'name', headerName: 'Name', width: 200 },
		{ field: 'description', headerName: 'Description', width: 200 },
		{
			field      : 'link',
			headerName : 'Details',
			renderCell : (params) => <DetailsLinkBtn to={params.value} />
		},
		{ field: 'created_at', headerName: 'Created', width: 150 }
	];

	return (
		<div style={{ width: '100%' }} className={classes.root}>
			<DataGrid
				rows={groupRows}
				columns={columns}
				pageSize={10}
				autoHeight
			/>
		</div>
	);
}
export default GroupList;
