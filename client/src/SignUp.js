import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { signUpUser } from './actions/auth';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import useStyles from './styles/formStyle';
import SelectCoordinates from './SelectCoordinates';
// TODO change geolocation request to use my location

function SignUp() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const INITIAL_FORM_DATA = {
		username : '',
		email    : '',
		password : '',
		img_url  : ''
	};
	const [ formData, setFormData ] = useState(INITIAL_FORM_DATA);
	const [ coordinates, setCoordinates ] = useState({ lat: '', lng: '' });

	const handleChange = (evt) => {
		const { name, value } = evt.target;

		setFormData((fData) => ({
			...fData,
			[name] : value
		}));
	};

	const handleCoordinatesChange = (data) => {
		console.log('handleCoordinatesChange', data);
		const { name, value } = data;

		setCoordinates((fData) => ({
			...fData,
			[name] : value
		}));
	};

	const handleMapCoordinatesChange = (coords) => {
		console.log('handleMapCoordinatesChange', coords);

		setCoordinates(coords);
	};

	const handleSubmit = (evt) => {
		evt.preventDefault();
		// email and password required by Firebase Authentication
		const credentials = {
			email    : formData.email,
			password : formData.password
		};
		// user data required by TreeMarkableApi to create user
		delete formData.password;
		const userData = {
			...formData,
			home_geolocation : {
				latitude  : coordinates.lat,
				longitude : coordinates.lng
			},
			is_admin         : false
		};
		dispatch(signUpUser(credentials, userData));
	};

	return (
		<Grid container className="Signup">
			Signup Page
			<form onSubmit={handleSubmit} className={classes.form}>
				<TextField
					id="username"
					name="username"
					label="Username"
					onChange={handleChange}
					value={formData.username}
					autoComplete="username"
				/>
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
				<TextField
					id="img_url"
					name="img_url"
					label="Profile Image URL"
					onChange={handleChange}
					value={formData.img_url}
					autoComplete="img_url"
				/>
				Select Home Location
				<SelectCoordinates
					formData={coordinates}
					onCoordinatesChange={handleCoordinatesChange}
					onMapCoordinatesChange={handleMapCoordinatesChange}
				/>
				<Button type="submit">Signup</Button>
			</form>
		</Grid>
	);
}
export default SignUp;
