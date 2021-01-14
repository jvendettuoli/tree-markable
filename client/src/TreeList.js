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

function TreeList({ trees }) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { username, savedTreeIds } = useSelector((st) => st.currUser);
	const treeRows = trees.map((tree) => ({
		isFavTree : {
			id    : tree.id,
			isFav : checkTreeIdInUserFavs(savedTreeIds, tree.id)
		},
		...tree,
		link      : `trees/${tree.id}`
	}));

	const handleUnfavoriteClick = (evt) => {
		const treeId = parseInt(evt.currentTarget.dataset.treeId);
		dispatch(removeFromSavedTrees(username, treeId));
	};
	const handleFavoriteClick = (evt) => {
		const treeId = parseInt(evt.currentTarget.dataset.treeId);
		dispatch(addToSavedTrees(username, treeId));
	};

	const columns = [
		{
			field           : 'isFavTree',
			renderHeader    : (params) => <FavoriteIcon />,
			headerClassName : 'data-grid-fav-header',
			headerAlign     : 'center',
			renderCell      : (params) => {
				return params.value.isFav ? (
					<IconButton
						data-tree-id={params.value.id}
						onClick={handleUnfavoriteClick}
					>
						<FavoriteIcon htmlColor="red" />
					</IconButton>
				) : (
					<IconButton
						data-tree-id={params.value.id}
						onClick={handleFavoriteClick}
					>
						<FavoriteBorderIcon htmlColor="pink" />
					</IconButton>
				);
			},
			sortComparator  : (v1, v2, param1, param2) => {
				//sort by favorited status of true or false
				return v1.isFav === v2.isFav ? 0 : v1.isFav ? -1 : 1;
			}
		},
		{ field: 'name', headerName: 'Name' },
		{ field: 'common_name', headerName: 'Common Name' },
		{
			field      : 'scientific_name',
			headerName : 'Scientific Name'
		},
		{ field: 'height', headerName: 'Ht. (ft.)', type: 'number' },
		{ field: 'dsh', headerName: 'DSH (in.)', type: 'number' },
		{
			field          : 'fruit_bearing',
			headerName     : 'Fruit Bearing',
			valueFormatter : (params) => {
				return params.value === true ? 'Yes' : ' ';
			}
		},
		{ field: 'leaf_type', headerName: 'Leaf Type' },
		{
			field      : 'link',
			headerName : 'Details',
			renderCell : (params) => <DetailsLinkBtn to={params.value} />
		}
	];

	return (
		<div style={{ width: '100%' }} className={classes.root}>
			<DataGrid
				rows={treeRows}
				columns={columns}
				pageSize={10}
				autoHeight
				// onSelectionChange={handleChange}
			/>
		</div>
	);
}
export default TreeList;
