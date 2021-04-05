import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { signInUser, signOutUser } from '../actions/auth';
import { errorDisplay } from '../helpers/formErrorDisplay';
import SignInForm from './SignInForm';

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

function SignIn() {
	console.log('SignIn Component - Start');
	const classes = useStyles();
	const theme = useTheme();
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
		<Grid container className={classes.innerContent}>
			<Grid item xs={12}>
				<Typography variant="h3" gutterBottom>
					Sign In
				</Typography>
				<Typography gutterBottom>
					Don't have an account? Sign up{' '}
					<Link component={RouterLink} to="/signup" style={{ color: theme.palette.primary.light }}>
						here
					</Link>{' '}
					, or browse the publically available trees and groups.
				</Typography>

				<SignInForm submitFormData={submitFormData} />
			</Grid>
		</Grid>
	);
}
export default SignIn;
