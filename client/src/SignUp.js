import React, { useState } from 'react';
import { signUp } from './firebase/firebaseAuth';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({});

function SignUp() {
	const classes = useStyles();
	const INITIAL_FORM_DATA = {
		email    : '',
		password : ''
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
		signUp(formData.email, formData.password);
	};
	return (
		<Grid container className="Signup">
			Signup Page
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
				<Button type="submit">Signup</Button>
			</form>
		</Grid>
	);
}
export default SignUp;
