import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

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
import { updateTreeInApi } from './actions/trees';
import { TransitEnterexitRounded } from '@material-ui/icons';

function EditTree() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const tree = useSelector((st) => st.trees.trees[id]);
	const history = useHistory();
	const INITIAL_TREE_FORM_DATA = {
		name            : tree.name,
		description     : tree.description || '',
		common_name     : tree.common_name || '',
		scientific_name : tree.scientific_name || '',
		height          : tree.height || '',
		dsh             : tree.dsh || '',
		leaf_type       : tree.leaf_type || '',
		fruit_bearing   : tree.fruit_bearing || false
	};
	const classes = useStyles();
	const [ treeFormData, setTreeFormData ] = useState(
		INITIAL_TREE_FORM_DATA
	);
	const [ coordinates, setCoordinates ] = useState({
		lat : tree.geolocation.y,
		lng : tree.geolocation.x
	});
	const [ imageFiles, setImageFiles ] = useState([]);

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
	// and make POST request to edit tree
	const handleSubmit = async (evt) => {
		evt.preventDefault();

		let editTree = {
			...treeFormData,
			geolocation : {
				latitude  : parseFloat(coordinates.lat),
				longitude : parseFloat(coordinates.lng)
			},
			height      : treeFormData.height || null,
			dsh         : treeFormData.dsh || null
		};

		console.log('editTree', editTree);
		dispatch(updateTreeInApi(id, editTree));

		console.log('ImageFiles', imageFiles);
		await uploadImagesToFirebase(treesRef, id, imageFiles);

		history.push(`/trees/${id}`);
	};

	return (
		<div>
			<Typography variant="h4" gutterBottom>
				Edit Tree
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
					Edit Tree
				</Button>
			</form>
		</div>
	);
}
export default EditTree;
