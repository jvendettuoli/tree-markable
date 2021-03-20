import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';



import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { signUpUser } from '../actions/auth';
import { errorDisplay } from '../helpers/formErrorDisplay';
import useStyles from '../styles/formStyle';
import SignUpForm from './SignUpForm';
import SelectCoordinates from '../leafletMap/SelectCoordinates';
import { getUserFromApi } from '../actions/currUser';
// TODO change geolocation request to use my location

function SignUp() {
	const classes = useStyles();
	const history = useHistory();
	const dispatch = useDispatch();
	const isAuthenticated = useSelector((st) => st.auth.authenticated);
	const username = useSelector((st) => st.currUser.username);

	// Avoid updating during an existing state transition by checking
	// auth status in useEffect
	useEffect(
		() => {
			// If user is authenticated, push to user page
			if (isAuthenticated) {
				history.push(`/users/${username}`);
			}
		},
		[ isAuthenticated, username ]
	);

	const submitFormData = (formData) => {
		// email and password required by Firebase Authentication
		const credentials = {
			email    : formData.email,
			password : formData.password
		};
		// remove password for TreeMarkableApi user creation
		const userData = { ...formData };
		delete userData.password;

		dispatch(signUpUser(credentials, userData));
	};

	return (
		<Grid container className={classes.form}>
			<Typography variant="h3" gutterBottom>
				Sign Up
			</Typography>
			<Grid item>
				<SignUpForm submitFormData={submitFormData} />
			</Grid>
		</Grid>
	);
}

export default SignUp;
