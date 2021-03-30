import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { getGroupsFromApi } from '../actions/groups';

import useStyles from '../styles/formStyle';

function GroupSearchForm() {
	const classes = useStyles();
	const dispatch = useDispatch();

	const [ formData, setFormData ] = useState({
		search : ''
	});

	const handleChange = (evt) => {
		const { name, value } = evt.target;

		setFormData((fData) => ({
			...fData,
			[name] : value
		}));
	};

	const handleSubmit = (evt) => {
		evt.preventDefault();
		setFormData(formData);

		const searchParams = {
			search : formData.search
		};

		for (let field in searchParams) {
			if (searchParams[field] === '') {
				delete searchParams[field];
			}
		}

		console.log('Searchparams', searchParams);
		dispatch(getGroupsFromApi(searchParams));
	};

	return (
		<form onSubmit={handleSubmit} className={classes.form}>
			<Grid container>
				<Typography variant="h3" gutterBottom>
					Explore Groups
				</Typography>
				<Grid container item xs={12}>
					<Grid item xs>
						<TextField
							id="search"
							name="search"
							label="Search Term"
							placeholder="Search Group Name..."
							fullWidth
							onChange={handleChange}
							value={formData.search}
						/>
					</Grid>
					<Grid item xs={2}>
						<Button variant="outlined" color="secondary" type="submit">
							Search
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</form>
	);
}

export default GroupSearchForm;
