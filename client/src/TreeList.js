import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { DataGrid } from '@material-ui/data-grid';

import {
	FavoriteBorder as FavoriteBorderIcon,
	Favorite as FavoriteIcon
} from '@material-ui/icons';

import FavoriteIconBtn from './FavoriteIconBtn';
import EditTreeInGroupIconBtn from './EditTreeInGroupIconBtn';

import { addToSavedTrees, removeFromSavedTrees } from './actions/currUser';

const useStyles = makeStyles((theme) => ({
	treeListContainer : {
		backgroundColor           : theme.palette.background.paper,
		'& .data-grid-fav-header' : {
			'& .MuiDataGrid-colCellTitleContainer' : {
				alignItems : 'center'
			}
		},
		display                   : 'flex',
		height                    : '100%'
	}
}));

function DetailsLinkBtn(props) {
	return (
		<Button color="primary" component={Link} {...props}>
			Show
		</Button>
	);
}

const checkTreeIdInCollection = (collection, treeId) => {
	return collection.includes(treeId);
};

function TreeList({ trees, group = null }) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { username, savedTreeIds } = useSelector((st) => st.currUser);
	let treeRows;
	console.log('TreeLIst - trees', trees);
	if (!group) {
		treeRows = trees.map((tree) => ({
			isFavTree : {
				id    : tree.id,
				isFav : checkTreeIdInCollection(savedTreeIds, tree.id)
			},
			...tree,
			link      : `trees/${tree.id}`
		}));
	}
	else if (group) {
		treeRows = trees.map((tree) => ({
			treeInGroup : {
				id          : tree.id,
				treeInGroup : checkTreeIdInCollection(group.trees, tree.id)
			},
			...tree,
			link        : `trees/${tree.id}`
		}));
	}

	const columns = [
		!group && {
			field           : 'isFavTree',
			renderHeader    : (params) => <FavoriteIcon />,
			headerClassName : 'data-grid-fav-header',
			headerAlign     : 'center',
			renderCell      : (params) => {
				return (
					<FavoriteIconBtn treeId={parseInt(params.value.id)} />
				);
			},
			sortComparator  : (value1, value2, param1, param2) => {
				//sort by favorited status of true or false
				return value1.isFav === value2.isFav
					? 0
					: value1.isFav ? -1 : 1;
			}
		},
		group !== null && {
			field           : 'treeInGroup',
			headerName      : 'Add Tree',
			headerClassName : 'data-grid-tree-in-group-header',
			headerAlign     : 'center',
			width           : 120,
			renderCell      : (params) => {
				return (
					<EditTreeInGroupIconBtn
						group={group}
						treeId={parseInt(params.value.id)}
					/>
				);
			},
			sortComparator  : (value1, value2, param1, param2) => {
				//sort by whether tree is in group trees of true or false
				return value1.treeInGroup === value2.treeInGroup
					? 0
					: value1.treeInGroup ? -1 : 1;
			}
		},
		{ field: 'name', headerName: 'Name', width: 150 },
		{ field: 'common_name', headerName: 'Common Name' },
		{
			field      : 'scientific_name',
			headerName : 'Scientific Name'
		},
		{ field: 'height', headerName: 'Ht. (ft.)', type: 'number' },
		{ field: 'dsh', headerName: 'DBH (in.)', type: 'number' },
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

	if (!username) columns.shift();

	return (
		<div className={classes.treeListContainer}>
			<div style={{ flexGrow: 1 }}>
				<DataGrid
					rows={treeRows}
					columns={columns}
					pageSize={10}
					autoHeight
				/>
			</div>
		</div>
	);
}
export default TreeList;
