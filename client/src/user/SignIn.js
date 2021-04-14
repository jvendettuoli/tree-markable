import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { signInUser } from '../actions/auth';
import SignInForm from './SignInForm';

import innerContent from '../styles/innerContent';
import form from '../styles/form';

const useStyles = makeStyles((theme) => {
	return {
		innerContent : innerContent(theme),
		form         : form(theme)
	};
});

function SignIn() {
	console.log('SignIn Component - Start');
	const theme = useTheme();
	const classes = useStyles(theme);

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
