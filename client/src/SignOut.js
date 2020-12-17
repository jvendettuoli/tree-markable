import React, { useState } from 'react';
import { signOut, currentUser, getToken } from './firebase/firebaseAuth';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({});

function Login() {
	const classes = useStyles();

	const handleClick = (evt) => {
		signOut();
	};
	const handleClickUser = (evt) => {
		currentUser();
		getToken();
	};

	return (
		<Grid container className="Login">
			Sign Out Page
			<Button type="submit" onClick={handleClick}>
				Sign Out
			</Button>
			<Button type="submit" onClick={handleClickUser}>
				Check User
			</Button>
		</Grid>
	);
}
export default Login;
