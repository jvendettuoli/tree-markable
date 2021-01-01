import React, { useState } from 'react';
import { storageRef } from './firebase/firebaseStorage';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import useStyles from './styles/formStyle';

function ImagesInput({ handleImagesInput }) {
	const classes = useStyles();
	const [ imageUrls, setImageUrls ] = useState([]);

	const readUploadedFileAsDataUrl = (inputFile) => {
		const temporaryFileReader = new FileReader();

		return new Promise((resolve, reject) => {
			temporaryFileReader.onerror = () => {
				temporaryFileReader.abort();
				reject(new DOMException('Problem parsing input file.'));
			};

			temporaryFileReader.onload = () => {
				resolve(temporaryFileReader.result);
			};
			temporaryFileReader.readAsDataURL(inputFile);
		});
	};

	const generateThumbnails = async (files) => {
		console.log('gneratethumbsfiles', files);
		let urls = [];

		for (let i = 0; i < files.length; i++) {
			const url = await readUploadedFileAsDataUrl(files[i]);
			urls.push(url);
		}

		setImageUrls(urls);
		console.log('imageUrls', imageUrls);
	};

	const handleChange = async (evt) => {
		const files = evt.target.files;
		handleImagesInput(files);

		generateThumbnails(files);
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
			<Grid item xs={12}>
				{imageUrls.map((url) => (
					<img
						key={url}
						className={classes.imgPreview}
						src={url}
					/>
				))}
			</Grid>
		</Grid>
	);
}
export default ImagesInput;
