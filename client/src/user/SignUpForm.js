import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { signUpUser } from '../actions/auth';
import { errorDisplay } from '../helpers/formErrorDisplay';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import useStyles from '../styles/formStyle';
import SelectCoordinates from '../leafletMap/SelectCoordinates';
import { getUserFromApi } from '../actions/currUser';
// TODO change geolocation request to use my location

function SignUpForm({ submitFormData }) {
	const classes = useStyles();

	const authErrors = useSelector((st) => st.auth.error);

	const INITIAL_FORM_DATA = {
		username : '',
		email    : '',
		password : '',
		img_url  : ''
	};
	const [ formData, setFormData ] = useState(INITIAL_FORM_DATA);

	const handleChange = (evt) => {
		const { name, value } = evt.target;

		setFormData((fData) => ({
			...fData,
			[name] : value
		}));
	};
	const handleSubmit = (evt) => {
		evt.preventDefault();
		submitFormData(formData);
	};

	const handleErrorDisplay = (field) => {
		return errorDisplay(field, authErrors);
	};

	return (
		<form onSubmit={handleSubmit} className={classes.form}>
			<TextField
				id="username"
				name="username"
				label="Username"
				onChange={handleChange}
				value={formData.username}
				autoComplete="username"
				required
				inputProps={{ minLength: 1, maxLength: 55 }}
				error={Boolean(handleErrorDisplay('username'))}
				helperText={handleErrorDisplay('username')}
			/>
			<TextField
				id="email"
				name="email"
				label="Email"
				type="email"
				onChange={handleChange}
				value={formData.email}
				autoComplete="email"
				required
				inputProps={{ minLength: 6, maxLength: 60 }}
				error={Boolean(handleErrorDisplay('email'))}
				helperText={handleErrorDisplay('email')}
			/>
			<TextField
				id="password"
				name="password"
				label="Password"
				type="password"
				onChange={handleChange}
				value={formData.password}
				autoComplete="password"
				required
				inputProps={{ minLength: 6 }}
				error={Boolean(handleErrorDisplay('password'))}
				helperText={handleErrorDisplay('password')}
			/>

			{/* <TextField
				id="img_url"
				name="img_url"
				label="Profile Image URL"
				type="url"
				onChange={handleChange}
				value={formData.img_url}
			/> */}
			<Button variant="contained" color="secondary" type="submit">
				Sign Up
			</Button>
		</form>
	);
}
export default SignUpForm;
