import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import useStyles from '../styles/formStyle';
import { errorDisplay } from '../helpers/formErrorDisplay';

function GroupFormBasicFields({ errors, formData, onFormChange, edit = false }) {
	const classes = useStyles();
	const groupError = useSelector((st) => st.groups.error);
	console.log(groupError);
	const handleChange = (evt) => {
		onFormChange(evt.target);
	};

	const handleErrorDisplay = (field) => {
		return errorDisplay(field, groupError);
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
				required={!edit}
				error={Boolean(handleErrorDisplay('group_name'))}
				helperText={handleErrorDisplay('group_name')}
			/>
			<TextField
				id="description"
				name="description"
				label="Description"
				multiline
				inputProps={{ maxLength: 2000 }}
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
