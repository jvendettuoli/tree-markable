import React, { useState } from 'react';
import { signInUser } from './actions/auth';
import { useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({});

function SignIn() {
	const classes = useStyles();
	const INITIAL_FORM_DATA = {
		email    : '',
		password : ''
	};
	const [ formData, setFormData ] = useState(INITIAL_FORM_DATA);
	const dispatch = useDispatch();

	const handleChange = (evt) => {
		const { name, value } = evt.target;

		setFormData((fData) => ({
			...fData,
			[name] : value
		}));
	};

	const handleSubmit = (evt) => {
		evt.preventDefault();
		console.log('SignIn submit');
		dispatch(signInUser(formData));
		console.log('SignIn submit post');
	};
	return (
		<Grid container className="SignIn">
			SignIn Page
			<form onSubmit={handleSubmit}>
				<TextField
					id="email"
					name="email"
					label="Email"
					onChange={handleChange}
					value={formData.email}
					autoComplete="email"
				/>
				<TextField
					id="password"
					name="password"
					label="Password"
					type="password"
					onChange={handleChange}
					value={formData.password}
					autoComplete="password"
				/>
				<Button type="submit">SignIn</Button>
			</form>
		</Grid>
	);
}
export default SignIn;
