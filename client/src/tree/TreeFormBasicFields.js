import React, { useState, useRef, useEffect } from 'react';

import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import useStyles from '../styles/formStyle';
import TreeMarkableApi from '../TreeMarkableApi';
import SelectLocationMap from '../leafletMap/LeafletMap';
import { treesRef, uploadImagesToFirebase } from '../firebase/firebaseStorage';
import ImagesInput from '../imageHandling/ImagesInput';

function TreeFormBasicFields({ edit = false, formData, onFormChange }) {
	const classes = useStyles();

	const handleChange = (evt) => {
		onFormChange(evt.target);
	};

	return (
		<Grid container className={classes.form}>
			<TextField
				id="name"
				name="name"
				label="Tree Name"
				placeholder="Hyperion"
				onChange={handleChange}
				value={formData.name}
				required={!edit}
			/>
			<TextField
				id="description"
				name="description"
				label="Description"
				multiline
				placeholder="World's tallest known living tree!"
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
			<FormControlLabel
				control={
					<Checkbox
						id="fruit_bearing"
						name="fruit_bearing"
						onChange={handleChange}
						checked={formData.fruit_bearing}
						color="primary"
					/>
				}
				label="Fruit Bearing? Consider adding what type of fruit to the description!"
			/>
		</Grid>
	);
}
export default TreeFormBasicFields;
