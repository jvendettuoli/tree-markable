import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
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
	const history = useHistory();
	const INITIAL_TREE_FORM_DATA = {
		name            : '',
		description     : '',
		common_name     : '',
		scientific_name : '',
		height          : '',
		dsh             : '',
		leaf_type       : '',
		fruit_bearing   : false
	};
	const classes = useStyles();
	const [ treeFormData, setTreeFormData ] = useState(
		INITIAL_TREE_FORM_DATA
	);
	const [ coordinates, setCoordinates ] = useState({ lat: '', lng: '' });
	const [ imageFiles, setImageFiles ] = useState([]);

	console.log('CreateNewTree Load - coordinates', coordinates);
	console.log('CreateNewTree Load - imageFiles', imageFiles);

	useEffect(() => {});

	const handleTreeFormChange = (data) => {
		let { name, value } = data;
		if (name === 'fruit_bearing') {
			value = data.checked;
		}

		setTreeFormData((fData) => ({
			...fData,
			[name] : value
		}));
	};

	const handleCoordinatesChange = (data) => {
		console.log('CreateNewTree - handleCoordinatesChange', data);
		const { name, value } = data;

		setCoordinates((fData) => ({
			...fData,
			[name] : value
		}));
	};

	const handleMapCoordinatesChange = (coords) => {
		console.log('CreateNewTree - handleMapCoordinatesChange', coords);

		setCoordinates(coords);
	};

	const handleImageFilesChange = (files) => {
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
		try {
			const res = await TreeMarkableApi.createTree(newTree);
			console.log('Trees Submit res', res);
			console.log(
				'CreateNewTree- handleSubmit -ImageFiles',
				imageFiles
			);
			await uploadImagesToFirebase(treesRef, res.id, imageFiles);

			history.push(`/trees/${res.id}`);
		} catch (err) {
			console.log('TreeForm Errors', err);
		}
	};

	return (
		<div>
			<Typography variant="h4" gutterBottom>
				Create New Tree
			</Typography>
			<form onSubmit={handleSubmit} className={classes.form}>
				<TreeFormBasicFields
					formData={treeFormData}
					onFormChange={handleTreeFormChange}
				/>
				<Typography variant="h5" gutterBottom>
					Tree Location
				</Typography>
				<SelectCoordinates
					formData={coordinates}
					onCoordinatesChange={handleCoordinatesChange}
					onMapCoordinatesChange={handleMapCoordinatesChange}
				/>
				<Divider variant="middle" />
				<div>
					<Typography variant="h5" gutterBottom>
						Add Images
					</Typography>
					<ImagesInput
						onImageFilesChange={handleImageFilesChange}
					/>
					<Divider variant="middle" />
				</div>

				<Button
					color="secondary"
					variant="contained"
					type="submit"
				>
					Create Tree
				</Button>
			</form>
		</div>
	);
}
export default CreateNewTree;
