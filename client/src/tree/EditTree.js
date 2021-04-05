import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import TreeFormBasicFields from './TreeFormBasicFields';
import SelectCoordinates from '../leafletMap/SelectCoordinates';
import ImagesInput from '../imageHandling/ImagesInput';
import { updateTree, deleteTree } from '../actions/trees';
import { removeFromSavedTrees } from '../actions/currUser';

const useStyles = makeStyles({
	innerContent : {
		padding : 20
	},
	form         : {
		display       : 'flex',
		flexDirection : 'column',
		'& div'       : {
			marginBottom : 10
		}
	}
});

function EditTree() {
	console.log('EditTree - start');
	const classes = useStyles();
	const theme = useTheme();
	const { id } = useParams();
	const dispatch = useDispatch();
	const [ action, setAction ] = useState(null);
	const status = useSelector((st) => st.trees.status);
	const tree = useSelector((st) => st.trees.entities[id]);
	const history = useHistory();

	//Check if there was a successful action dispatched. If there was,
	//push to appropriate path depending on action set in state.

	if (status === 'success') {
		if (action === 'delete') history.push('/trees');
		if (action === 'update') history.push(`/trees/${id}`);
	}

	const INITIAL_TREE_FORM_DATA =
		tree !== undefined
			? {
					name            : tree.name,
					description     : tree.description || '',
					common_name     : tree.common_name || '',
					scientific_name : tree.scientific_name || '',
					height          : tree.height || '',
					dsh             : tree.dsh || '',
					leaf_type       : tree.leaf_type || '',
					fruit_bearing   : tree.fruit_bearing || false
				}
			: null;
	const [ treeFormData, setTreeFormData ] = useState(INITIAL_TREE_FORM_DATA);
	const [ coordinates, setCoordinates ] = useState({
		lat : tree !== undefined ? tree.geolocation.y : null,
		lng : tree !== undefined ? tree.geolocation.x : null
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
		// console.log('EditTree - handleCoordinatesChange', data);
		const { name, value } = data;
		setCoordinates((fData) => ({
			...fData,
			[name] : value
		}));
	};

	const handleMapCoordinatesChange = (coords) => {
		// console.log('EditTree - handleMapCoordinatesChange', coords);
		setCoordinates(coords);
	};

	const handleImageFilesChange = (files) => {
		// console.log('EditTree - handleImageFilesChange', files);
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

		setAction('update');
		dispatch(updateTree(id, editTree, imageFiles));
	};

	const handleDelete = async () => {
		setAction('delete');
		dispatch(removeFromSavedTrees(tree.creator, id));
		dispatch(deleteTree(id));
	};

	const handleCancel = () => {
		history.push(`/trees/${id}`);
	};

	return (
		<div className={classes.innerContent}>
			<Typography variant="h4" gutterBottom>
				Edit Tree
			</Typography>
			<form onSubmit={handleSubmit} className={classes.form}>
				<TreeFormBasicFields edit={true} formData={treeFormData} onFormChange={handleTreeFormChange} />
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
						Edit Images
					</Typography>
					<Typography gutterBottom>
						Ignore this section if you want to leave them the same. Any images added will overwrite
						previously uploaded images.
					</Typography>
					<ImagesInput onImageFilesChange={handleImageFilesChange} />
					<Divider variant="middle" />
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Button color="secondary" variant="contained" onClick={handleCancel}>
						Go Back
					</Button>
					<Button
						style={{ backgroundColor: theme.palette.error.main, color: theme.palette.error.contrastText }}
						variant="contained"
						onClick={handleDelete}
					>
						Delete Tree
					</Button>
					<Button color="primary" variant="contained" type="submit">
						Edit Tree
					</Button>
				</div>
			</form>
		</div>
	);
}
export default EditTree;
