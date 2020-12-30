import React, { useState, useRef, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import useStyles from './styles/formStyle';

import TreeMarkableApi from './TreeMarkableApi';
import SelectLocationMap from './SelectLocationMap';
import {
	treesRef,
	uploadImagesToFirebase
} from './firebase/firebaseStorage';
import ImagesInput from './ImagesInput';

function TreeForm() {
	const classes = useStyles();
	const INITIAL_FORM_DATA = {
		name            : '',
		description     : '',
		common_name     : '',
		scientific_name : '',
		geolocation_lat : '',
		geolocation_lng : '',
		height          : '',
		dsh             : '',
		leaf_type       : ''
	};
	const [ formData, setFormData ] = useState(INITIAL_FORM_DATA);
	const [ showSelectMap, setShowSelectMap ] = useState(false);
	const [ imageFiles, setImageFiles ] = useState([]);

	// Scroll to map when shown for selecting tree location
	const mapToggleRef = useRef(null);
	useEffect(
		() => {
			if (showSelectMap && mapToggleRef.current) {
				mapToggleRef.current.scrollIntoView({
					behavior : 'smooth'
				});
			}
		},
		[ showSelectMap ]
	);

	const handleChange = (evt) => {
		const { name, value } = evt.target;

		setFormData((fData) => ({
			...fData,
			[name] : value
		}));
	};

	const handleImagesInput = (files) => {
		console.log('files,', files);
		setImageFiles(files);
	};

	// passes clicked coordinates from map to formData
	const passTreeLocation = (treeCoors) => {
		setFormData((fData) => ({
			...fData,
			geolocation_lat : treeCoors.lat,
			geolocation_lng : treeCoors.lng
		}));
	};

	const toggleSelectMap = (evt) => {
		setShowSelectMap(!showSelectMap);
	};
	const selectMapBtn = () => {
		return !showSelectMap ? (
			<Typography>Select Via Map</Typography>
		) : (
			<Typography>Hide Map</Typography>
		);
	};
	const displaySelectMap = () => {
		if (showSelectMap)
			return <SelectLocationMap setLocation={passTreeLocation} />;
	};

	// On form submit, convert data to type expected by server
	// and make POST request to create new tree
	const handleSubmit = async (evt) => {
		evt.preventDefault();
		console.log('Submit - form data', formData);

		/*
		TODO: Convert the data to fit the schema requirements. Remove empty fields
		*/
		let newTree = {
			...formData,
			geolocation : {
				latitude  : formData.geolocation_lat,
				longitude : formData.geolocation_lng
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

		delete newTree.geolocation_lat;
		delete newTree.geolocation_lng;

		console.log('newtree', newTree);

		const res = await TreeMarkableApi.createTree(newTree);
		console.log('Trees Submit res', res);
		console.log('ImageFiles', imageFiles);
		await uploadImagesToFirebase(treesRef, res.id, imageFiles);
	};
	return (
		<Grid container className="Signup">
			New Tree Form
			<form onSubmit={handleSubmit} className={classes.form}>
				<TextField
					id="name"
					name="name"
					label="Name"
					placeholder="The Giant on 8th Street"
					onChange={handleChange}
					value={formData.name}
					required
				/>
				<TextField
					id="description"
					name="description"
					label="Description"
					multiline
					placeholder="Amazing tree with wide spreading limbs!"
					onChange={handleChange}
					value={formData.description}
				/>

				<TextField
					id="common_name"
					name="common_name"
					label="Species Common Name"
					placeholder="Bigleaf Maple"
					onChange={handleChange}
					value={formData.common_name}
				/>

				<TextField
					id="scientific_name"
					name="scientific_name"
					label="Species Scientifc Name"
					placeholder="Acer Macrophyllum"
					onChange={handleChange}
					value={formData.scientific_name}
				/>
				<TextField
					id="height"
					name="height"
					label="Height (ft.)"
					type="number"
					placeholder="From base to the tallest branch."
					inputProps={{ min: 0, max: 500, step: 0.01 }}
					onChange={handleChange}
					value={formData.height}
				/>
				<TextField
					id="dsh"
					name="dsh"
					label="Diameter Standard Height (in.)"
					type="number"
					inputProps={{ min: 0, max: 500, step: 0.01 }}
					placeholder="Trunk circumference 4.5ft above the ground."
					onChange={handleChange}
					value={formData.dsh}
				/>
				<TextField
					id="leaf_type"
					name="leaf_type"
					label="Leaf Type"
					select
					onChange={handleChange}
					value={formData.leaf_type}
				>
					<MenuItem value="">Unknown</MenuItem>
					<MenuItem value="deciduous">Deciduous</MenuItem>
					<MenuItem value="evergreen">Evergreen</MenuItem>
				</TextField>
				<Grid item container>
					<TextField
						id="geolocation_lat"
						name="geolocation_lat"
						label="Latitude"
						type="number"
						inputProps={{ step: 'any', min: -90, max: 90 }}
						InputLabelProps={{ shrink: true }}
						placeholder="-90 to 90 (eg. 48.10045)"
						onChange={handleChange}
						value={formData.geolocation_lat}
						required
					/>
					<TextField
						id="geolocation_lng"
						name="geolocation_lng"
						label="Longitude"
						type="number"
						inputProps={{ step: 'any', min: -180, max: 180 }}
						InputLabelProps={{ shrink: true }}
						placeholder="-180 to 180 (eg. -123.45316)"
						onChange={handleChange}
						value={formData.geolocation_lng}
						required
					/>
					<Button
						variant="outlined"
						onClick={toggleSelectMap}
						ref={mapToggleRef}
					>
						{selectMapBtn()}
					</Button>
					{displaySelectMap()}
				</Grid>
				<ImagesInput handleImagesInput={handleImagesInput} />
				<Button type="submit">Create Tree</Button>
			</form>
		</Grid>
	);
}
export default TreeForm;
