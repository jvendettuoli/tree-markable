import React, { useState, useRef, useEffect } from 'react';
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

function ListItemLink(props) {
	return <ListItem button component="a" {...props} />;
}

function TreeList({ trees }) {
	const classes = useStyles();

	const columns = [
		{ field: 'name', headerName: 'Name', width: 150 },
		{ field: 'common_name', headerName: 'Common Name', width: 150 },
		{
			field      : 'scientific_Name',
			headerName : 'Scientific Name',
			width      : 200
		},
		{ field: 'height', headerName: 'Height', width: 80 },
		{ field: 'dsh', headerName: 'DSH', width: 80 }
	];

	// const handleChange = (evt) => {
	// 	setSelectedRows(evt.rowIds);
	// };

	return (
		<div style={{ height: '85vh' }}>
			<DataGrid
				rows={trees}
				columns={columns}
				pageSize={10}
				checkboxSelection
				autoHeight
				// onSelectionChange={handleChange}
			/>
		</div>
	);
}
export default TreeList;
