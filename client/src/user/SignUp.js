import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import { signUpUser } from '../actions/auth';
import { errorDisplay } from '../helpers/formErrorDisplay';
import SignUpForm from './SignUpForm';
import SelectCoordinates from '../leafletMap/SelectCoordinates';
import { getUserFromApi } from '../actions/currUser';

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

function SignUp() {
	const classes = useStyles();
	const theme = useTheme();
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
		<Grid container className={classes.innerContent}>
			<Grid item xs={12}>
				<Typography variant="h3" gutterBottom>
					Sign Up
				</Typography>
				<Typography gutterBottom>
					Already have an account? Sign in{' '}
					<Link component={RouterLink} to="/signin" style={{ color: theme.palette.primary.light }}>
						here
					</Link>.
				</Typography>
				<Grid item>
					<SignUpForm submitFormData={submitFormData} />
				</Grid>
			</Grid>
		</Grid>
	);
}

export default SignUp;
