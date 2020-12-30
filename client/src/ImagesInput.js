import React, { useState } from 'react';
import { storageRef } from './firebase/firebaseStorage';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({});

function ImagesInput({ handleImagesInput }) {
	const classes = useStyles();

	const handleChange = (evt) => {
		const files = evt.target.files;
		handleImagesInput(files);
	};

	return (
		<Grid container className="ImagesInput">
			Input Images
			<Input
				accept="image/*"
				style={{ display: 'none' }}
				id="file-upload"
				type="file"
				inputProps={{ multiple: true }}
				onChange={handleChange}
			/>
			<Button htmlFor="file-upload" component="label">
				Choose Files
			</Button>
		</Grid>
	);
}
export default ImagesInput;
