import Button from '@material-ui/core/Button';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { errorDisplay } from '../helpers/formErrorDisplay';
import form from '../styles/form';
import innerContent from '../styles/innerContent';

const useStyles = makeStyles((theme) => {
	return {
		innerContent : innerContent(theme),
		form         : form(theme)
	};
});

function SignUpForm({ submitFormData }) {
	const theme = useTheme();
	const classes = useStyles(theme);
	const authErrors = useSelector((st) => st.auth.error);

	const INITIAL_FORM_DATA = {
		username : '',
		email    : '',
		password : '',
		img_url  : ''
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
		submitFormData(formData);
	};

	const handleErrorDisplay = (field) => {
		return errorDisplay(field, authErrors);
	};

	return (
		<form onSubmit={handleSubmit} className={classes.form}>
			<TextField
				id="username"
				name="username"
				label="Username"
				onChange={handleChange}
				value={formData.username}
				autoComplete="username"
				required
				inputProps={{ minLength: 1, maxLength: 55 }}
				error={Boolean(handleErrorDisplay('username'))}
				helperText={handleErrorDisplay('username')}
			/>
			<TextField
				id="email"
				name="email"
				label="Email"
				type="email"
				onChange={handleChange}
				value={formData.email}
				autoComplete="email"
				required
				inputProps={{ minLength: 6, maxLength: 60 }}
				error={Boolean(handleErrorDisplay('email'))}
				helperText={handleErrorDisplay('email')}
			/>
			<TextField
				id="password"
				name="password"
				label="Password"
				type="password"
				onChange={handleChange}
				value={formData.password}
				autoComplete="password"
				required
				inputProps={{ minLength: 6 }}
				error={Boolean(handleErrorDisplay('password'))}
				helperText={handleErrorDisplay('password')}
			/>

			{/* <TextField
				id="img_url"
				name="img_url"
				label="Profile Image URL"
				type="url"
				onChange={handleChange}
				value={formData.img_url}
			/> */}
			<Button variant="contained" color="secondary" type="submit">
				Sign Up
			</Button>
		</form>
	);
}
export default SignUpForm;
