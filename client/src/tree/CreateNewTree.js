import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addToSavedTrees } from '../actions/currUser';
import { createTree } from '../actions/trees';
import ImagesInput from '../imageHandling/ImagesInput';
import SelectCoordinates from '../leafletMap/SelectCoordinates';
import TreeFormBasicFields from './TreeFormBasicFields';

const useStyles = makeStyles({
	innerContent : {
		padding         : 20,
		backgroundColor : 'white'
	},
	form         : {
		display       : 'flex',
		flexDirection : 'column',
		'& div'       : {
			marginBottom : 10
		}
	}
});

function CreateNewTree() {
	const history = useHistory();
	const dispatch = useDispatch();
	const userId = useSelector((st) => st.currUser.uid);
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
	const [ treeFormData, setTreeFormData ] = useState(INITIAL_TREE_FORM_DATA);
	const [ coordinates, setCoordinates ] = useState({ lat: '', lng: '' });
	const [ imageFiles, setImageFiles ] = useState([]);

	console.log('CreateNewTree Load - coordinates', coordinates);
	console.log('CreateNewTree Load - imageFiles', imageFiles);

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
		console.log('CreateNewTree', newTree);
		const treeId = await dispatch(createTree(newTree, imageFiles));
		dispatch(addToSavedTrees(userId, treeId));

		if (treeId) {
			console.log('CreateNewTree - treeId', treeId);
			history.push(`/trees/${treeId}`);
		}
	};

	return (
		<div className={classes.innerContent}>
			<Typography variant="h4" gutterBottom>
				Create New Tree
			</Typography>
			<form onSubmit={handleSubmit} className={classes.form}>
				<TreeFormBasicFields formData={treeFormData} onFormChange={handleTreeFormChange} />
				<Typography variant="h5" gutterBottom>
					Tree Location
				</Typography>
				<SelectCoordinates
					formData={coordinates}
					onCoordinatesChange={handleCoordinatesChange}
					onMapCoordinatesChange={handleMapCoordinatesChange}
				/>
				<Divider variant="middle" style={{ marginTop: 15, marginBottom: 15 }} />
				<div>
					<Typography variant="h5" gutterBottom>
						Add Images
					</Typography>
					<ImagesInput onImageFilesChange={handleImageFilesChange} />
					<Divider variant="middle" style={{ marginBottom: 15 }} />
				</div>

				<Button color="secondary" variant="contained" type="submit">
					Create Tree
				</Button>
			</form>
		</div>
	);
}
export default CreateNewTree;
