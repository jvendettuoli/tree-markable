import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { signInUser } from './actions/auth';
import { useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import useStyles from './styles/formStyle';

function SignIn() {
	const classes = useStyles();
	const INITIAL_FORM_DATA = {
		email    : '',
		password : ''
	};
	const history = useHistory();
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
		dispatch(signInUser(formData));
		history.push('/');
	};
	return (
		<Grid container className={classes.form}>
			<Grid item>
				<Typography variant="h3" gutterBottom>
					Sign In
				</Typography>
				<form onSubmit={handleSubmit} className={classes.form}>
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
					<Button
						color="secondary"
						variant="contained"
						type="submit"
					>
						Sign In
					</Button>
				</form>
			</Grid>
		</Grid>
	);
}
export default SignIn;
