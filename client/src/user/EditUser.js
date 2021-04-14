import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { editCurrUser } from '../actions/currUser';
// import CurrUserInfo from './CurrUserInfo';
import { errorDisplay } from '../helpers/formErrorDisplay';
import form from '../styles/form';
import innerContent from '../styles/innerContent';

const useStyles = makeStyles((theme) => {
	return {
		innerContent : innerContent(theme),
		form         : form(theme)
	};
});

function EditUser() {
	const theme = useTheme();
	const classes = useStyles(theme);
	const history = useHistory();
	const dispatch = useDispatch();
	const { username, error } = useSelector((st) => st.currUser);
	const status = useSelector((st) => st.currUser.status);

	const INITIAL_FORM_DATA = {
		current_email    : '',
		current_password : '',
		username         : '',
		new_email        : '',
		new_password     : '',
		img_url          : ''
	};
	const [ formData, setFormData ] = useState(INITIAL_FORM_DATA);

	// When a user changes their username, push to the updated username
	// to prevent issues on a potential refresh.

	if (status === 'success') {
		history.push(`/users/${username}`);
	}

	const handleChange = (evt) => {
		const { name, value } = evt.target;

		setFormData((fData) => ({
			...fData,
			[name] : value
		}));
	};

	const handleCancel = () => {
		history.push(`/users/${username}`);
	};

	const handleSubmit = (evt) => {
		evt.preventDefault();

		// email and password required by Firebase Reauthentication
		const credentials = {
			email    : formData.current_email,
			password : formData.current_password
		};

		// user data required by TreeMarkableApi to edit user
		const userData = {
			username : formData.username,
			img_url  : formData.img_url,
			email    : formData.new_email,
			password : formData.new_password
		};

		for (let field in userData) {
			if (userData[field] === '') {
				delete userData[field];
			}
		}
		console.log('Edit User - handleSumbit - userData', userData);
		dispatch(editCurrUser(credentials, username, userData));
	};

	const handleErrorDisplay = (field) => {
		return errorDisplay(field, error);
	};

	return (
		<Grid container className={classes.innerContent} direction="column">
			<Grid item>
				<Typography variant="h3" gutterBottom>
					Edit User
				</Typography>
			</Grid>
			<Divider variant="middle" style={{ marginBottom: 15 }} />
			<Grid container item xs={12}>
				<Grid container direction="column" item xs={12}>
					<form onSubmit={handleSubmit} className={classes.form}>
						<Grid item>
							<Typography>Any fields left blank will be ignored.</Typography>
						</Grid>
						<Grid item>
							<TextField
								fullWidth
								id="username"
								name="username"
								label="New Username"
								onChange={handleChange}
								value={formData.username}
								inputProps={{ maxLength: 55 }}
								error={Boolean(handleErrorDisplay('username'))}
								helperText={handleErrorDisplay('username')}
							/>
						</Grid>
						<Grid item>
							<TextField
								fullWidth
								id="new_email"
								name="new_email"
								label="New Email"
								type="email"
								onChange={handleChange}
								value={formData.new_email}
								autoComplete="email"
								error={Boolean(handleErrorDisplay('email'))}
								helperText={handleErrorDisplay('email')}
							/>
						</Grid>
						<Grid item>
							<TextField
								fullWidth
								id="new_password"
								name="new_password"
								label="New Password"
								type="password"
								onChange={handleChange}
								value={formData.new_password}
								inputProps={{ minLength: 6 }}
								error={Boolean(handleErrorDisplay('new_password'))}
								helperText={handleErrorDisplay('new_password')}
							/>
						</Grid>
						{/* <Grid item >
							<TextField
								fullWidth
								id="img_url"
								name="img_url"
								label="New Profile Image URL"
								type="url"
								onChange={handleChange}
								value={formData.img_url}
								autoComplete="img_url"
							/>
						</Grid> */}
						<Grid item>
							<Typography variant="subtitle2">Verify Account</Typography>

							<TextField
								fullWidth
								id="current_password"
								name="current_password"
								label="Current Password"
								type="password"
								onChange={handleChange}
								value={formData.current_password}
								inputProps={{ minLength: 6 }}
								error={Boolean(handleErrorDisplay('password'))}
								helperText={handleErrorDisplay('password')}
							/>
						</Grid>
						<Grid container item justify="space-between" style={{ paddingLeft: 40, paddingRight: 40 }}>
							<Button onClick={handleCancel} variant="contained" color="secondary">
								Go Back
							</Button>
							<Button variant="contained" color="primary" type="submit">
								Save Edits
							</Button>
						</Grid>
					</form>
				</Grid>
				{/* <Grid container item xs={6}>
					<CurrUserInfo />
				</Grid> */}
			</Grid>
		</Grid>
	);
}
export default EditUser;
