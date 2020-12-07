import React, { useState } from 'react';
import { storageRef } from './firebase/firebaseStorage';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({});

function Upload() {
	const classes = useStyles();
	const INITIAL_FORM_DATA = {};
	const [ formData, setFormData ] = useState(INITIAL_FORM_DATA);
	const [ imgSrc, setImgSrc ] = useState('');

	const handleChange = (evt) => {
		console.log(evt.target.files.item(0));
		const file = evt.target.files.item(0);
		const imagesRef = storageRef.child(`images/${file.name}`);

		imagesRef.put(file).then(function(snapshot) {
			console.log('Uploaded');
		});

		console.log(file);
	};

	const handleSubmit = (evt) => {
		evt.preventDefault();
	};
	const handleDownload = (evt) => {
		evt.preventDefault();
		storageRef
			.child('images/tree-of-life-3.jpg')
			.getDownloadURL()
			.then(function(url) {
				console.log(url);

				setImgSrc(url);
			})
			.catch(function(error) {
				switch (error.code) {
					case 'storage/object-not-found':
						// File doesn't exist
						break;

					case 'storage/unauthorized':
						// User doesn't have permission to access the object
						break;

					case 'storage/canceled':
						// User canceled the upload
						break;

					case 'storage/unknown':
						// Unknown error occurred, inspect the server response
						break;
				}
			});
	};

	return (
		<Grid container className="Signup">
			Upload File
			<Input
				accept="image/*"
				style={{ display: 'none' }}
				id="file-upload"
				type="file"
				onChange={handleChange}
			/>
			<Button htmlFor="file-upload" component="label">
				Choose File
			</Button>
			<Button onClick={handleDownload}>Download </Button>
			<Box
				style={{
					width  : '100vw',
					height : '100vh',
					border : '1px solid red'
				}}
			>
				Image
				<img
					style={{
						width  : '100vw',
						height : '100vh',
						border : '1px solid red'
					}}
					src={imgSrc}
				/>
				);
			</Box>
		</Grid>
	);
}
export default Upload;
