import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { signInUser, signOutUser } from '../actions/auth';
import { errorDisplay } from '../helpers/formErrorDisplay';
import SignInForm from './SignInForm';
import useStyles from '../styles/formStyle';

function SignIn() {
	console.log('SignIn Component - Start');
	const classes = useStyles();
	const dispatch = useDispatch();
	const history = useHistory();
	const isAuthenticated = useSelector((st) => st.auth.authenticated);
	const username = useSelector((st) => st.currUser.username);
	const status = useSelector((st) => st.currUser.status);

	// Avoid updating during an existing state transition by checking
	// auth status in useEffect. Also redirect already logged in users
	useEffect(
		() => {
			// If user is authenticated, push to user page
			if ((isAuthenticated && status === 'idle') || status === 'successful') {
				history.push(`/users/${username}`);
			}
		},
		[ isAuthenticated, username, history, status ]
	);

	const submitFormData = (formData) => {
		dispatch(signInUser(formData));
	};

	return (
		<Grid container className={classes.form}>
			<Grid item>
				<Typography variant="h3" gutterBottom>
					Sign In
				</Typography>
				<SignInForm submitFormData={submitFormData} />
			</Grid>
		</Grid>
	);
}
export default SignIn;
