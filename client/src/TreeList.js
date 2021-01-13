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
import { DataGrid } from '@material-ui/data-grid';

import useStyles from './styles/formStyle';

import { getTreesFromApi } from './actions/trees';
import SelectLocationMap from './SelectLocationMap';
import {
	treesRef,
	uploadImagesToFirebase
} from './firebase/firebaseStorage';
import ImagesInput from './ImagesInput';

// const useStyles = makeStyles((theme) => ({
// 	root : {
// 		width           : '100%',
// 		maxWidth        : 360,
// 		backgroundColor : theme.palette.background.paper
// 	}
// }));

function DetailsLinkBtn(props) {
	return (
		<Button color="primary" component={Link} {...props}>
			Show
		</Button>
	);
}

function TreeList({ trees }) {
	const classes = useStyles();

	const treeRows = trees.map((tree) => ({
		...tree,
		link : `trees/${tree.id}`
	}));

	const columns = [
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
			headerName : 'Map',
			renderCell : (params) => <DetailsLinkBtn to={params.value} />
		}
	];

	// const handleChange = (evt) => {
	// 	setSelectedRows(evt.rowIds);
	// };

	return (
		<div style={{ width: '100%' }}>
			<div style={{ display: 'flex', height: '100%' }}>
				<div style={{ flexGrow: 1 }}>
					<DataGrid
						rows={treeRows}
						columns={columns}
						pageSize={10}
						checkboxSelection
						autoHeight
						// onSelectionChange={handleChange}
					/>
				</div>
			</div>
		</div>
	);
}
export default TreeList;
