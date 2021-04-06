import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useSelector } from 'react-redux';
import { errorDisplay } from '../helpers/formErrorDisplay';
import useStyles from '../styles/formStyle';

function GroupFormBasicFields({ formData, onFormChange, edit = false }) {
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
