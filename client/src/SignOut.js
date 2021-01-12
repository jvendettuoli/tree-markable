import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { signOutUser } from './actions/auth';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({});

function Login() {
	const classes = useStyles();
	const dispatch = useDispatch();

	const handleClick = (evt) => {
		dispatch(signOutUser());
	};

	return (
		<Grid container className="Login">
			Sign Out Page
			<Button type="submit" onClick={handleClick}>
				Sign Out
			</Button>
		</Grid>
	);
}
export default Login;
