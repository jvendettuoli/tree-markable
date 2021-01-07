import React, { useState, useRef, useEffect } from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import useStyles from './styles/formStyle';
import TreeMarkableApi from './TreeMarkableApi';
import TreeFormBasicFields from './TreeFormBasicFields';
import SelectCoordinates from './SelectCoordinates';
import {
	treesRef,
	uploadImagesToFirebase
} from './firebase/firebaseStorage';
import ImagesInput from './ImagesInput';

function CreateNewTree() {
	const INITIAL_TREE_FORM_DATA = {
		name            : '',
		description     : '',
		common_name     : '',
		scientific_name : '',
		height          : '',
		dsh             : '',
		leaf_type       : ''
	};
	const classes = useStyles();
	const [ treeFormData, setTreeFormData ] = useState(
		INITIAL_TREE_FORM_DATA
	);
	const [ coordinates, setCoordinates ] = useState({ lat: '', lng: '' });
	const [ imageFiles, setImageFiles ] = useState([]);

	const handleTreeFormChange = (data) => {
		console.log('handleTreeFormChange', data);
		const { name, value } = data;

		setTreeFormData((fData) => ({
			...fData,
			[name] : value
		}));
	};

	const handleCoordinatesChange = (data) => {
		console.log('handleCoordinatesChange', data);
		const { name, value } = data;

		setCoordinates((fData) => ({
			...fData,
			[name] : value
		}));
	};

	const handleMapCoordinatesChange = (coords) => {
		console.log('handleMapCoordinatesChange', coords);

		setCoordinates(coords);
	};

	const handleImageFilesChange = (files) => {
		console.log('handleImageFilesChange', files);

		setImageFiles(files);
	};

	// On form submit, convert data to type expected by server
	// and make POST request to create new tree
	const handleSubmit = async (evt) => {
		evt.preventDefault();

		let newTree = {
			...treeFormData,
			geolocation : {
				latitude  : parseFloat(coordinates.lat),
				longitude : parseFloat(coordinates.lng)
			}
		};

		for (let field in newTree) {
			if (newTree[field] === '') {
				delete newTree[field];
			}
			else if (field === 'height' || field === 'dsh') {
				newTree[field] = parseFloat(newTree[field]);
			}
		}

		console.log('newtree', newTree);

		const res = await TreeMarkableApi.createTree(newTree);
		console.log('Trees Submit res', res);
		console.log('ImageFiles', imageFiles);
		await uploadImagesToFirebase(treesRef, res.id, imageFiles);

		// TODO Add push to tree details page
	};

	return (
		<div>
			Create New Tree Form
			<form onSubmit={handleSubmit} className={classes.form}>
				<TreeFormBasicFields
					formData={treeFormData}
					onFormChange={handleTreeFormChange}
				/>
				<SelectCoordinates
					formData={coordinates}
					onCoordinatesChange={handleCoordinatesChange}
					onMapCoordinatesChange={handleMapCoordinatesChange}
				/>
				<ImagesInput onImageFilesChange={handleImageFilesChange} />
				<Button color="primary" variant="outlined" type="submit">
					Create Tree
				</Button>
			</form>
		</div>
	);
}
export default CreateNewTree;