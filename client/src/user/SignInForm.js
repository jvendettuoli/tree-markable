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

function SignIn({ submitFormData }) {
	const theme = useTheme();
	const classes = useStyles(theme);
	const authErrors = useSelector((st) => st.auth.error);

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
		submitFormData(formData);
	};
	const handleErrorDisplay = (field) => {
		return errorDisplay(field, authErrors);
	};

	return (
		<form onSubmit={handleSubmit} className={classes.form}>
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
				error={Boolean(handleErrorDisplay('password'))}
				helperText={handleErrorDisplay('password')}
			/>
			<Button color="secondary" variant="contained" type="submit">
				Sign In
			</Button>
		</form>
	);
}
export default SignIn;
