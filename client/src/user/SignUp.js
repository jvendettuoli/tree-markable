import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { signUpUser } from '../actions/auth';
import SignUpForm from './SignUpForm';

import form from '../styles/form';
import innerContent from '../styles/innerContent';

const useStyles = makeStyles((theme) => {
	return {
		innerContent : innerContent(theme),
		form         : form(theme)
	};
});

function SignUp() {
	const theme = useTheme();
	const classes = useStyles(theme);
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
		[ isAuthenticated, username, history ]
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
				<SignUpForm submitFormData={submitFormData} />
			</Grid>
		</Grid>
	);
}

export default SignUp;
