import React, { useState, useRef, useEffect } from 'react';

import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
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

function GroupFormBasicFields({ errors, formData, onFormChange }) {
	const classes = useStyles();

	const handleChange = (evt) => {
		onFormChange(evt.target);
	};

	return (
		<Grid container className={classes.form}>
			<TextField
				id="name"
				name="name"
				label="Group Name"
				placeholder="Clallam Tree Alliance"
				onChange={handleChange}
				value={formData.name}
				required
				error={errors.name}
				helperText={
					errors.name ? 'Group Name already exists.' : ''
				}
			/>
			<TextField
				id="description"
				name="description"
				label="Description"
				multiline
				placeholder="What is the main purpose of your group?"
				onChange={handleChange}
				value={formData.description}
			/>

			{/* TODO add in the future */}
			{/* <FormControlLabel
				control={
					<Checkbox
						id="is_public"
						name="is_public"
						onChange={handleChange}
						checked={formData.is_public}
						color="primary"
					/>
				}
				label="Do you want this group to be visable for others to join?"
			/> */}
		</Grid>
	);
}
export default GroupFormBasicFields;
