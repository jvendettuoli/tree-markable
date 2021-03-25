import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { storageRef } from '../firebase/firebaseStorage';


const useStyles = makeStyles((theme) => {
	return {
		imgPreview    : { height: 100, width: 'auto' },
		imgsContainer : {
			'& .selected' : {
				backgroundColor : theme.palette.primary.accent
			}
		},
		imgPaper      : {
			justifyContent : 'center',
			alignItems     : 'center',
			padding        : 4,
			paddingBottom  : 0
		}
	};
});

function ImagesInput({ allowMultiple = true, onImageFilesChange }) {
	const theme = useTheme();
	const classes = useStyles(theme);
	const [ imageUrls, setImageUrls ] = useState([]);
	const [ fileList, setFileList ] = useState([]);

	// Lift files to parent component
	useEffect(
		() => {
			console.log('useEffect fileList', fileList);
			onImageFilesChange(fileList);
		},
		[ fileList, onImageFilesChange ]
	);

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

	const getImageUrlsFromFiles = async (files) => {
		console.log('getImageUrlsFromFiles', files);
		let urls = [];

		for (let i = 0; i < files.length; i++) {
			const url = await readUploadedFileAsDataUrl(files[i]);
			urls.push(url);
		}

		setImageUrls(urls);
	};

	const handleChange = async (evt) => {
		const files = evt.target.files;
		const filesArr = Array.from(files);
		console.log('filesArr', filesArr);

		getImageUrlsFromFiles(files);
		setFileList((fileList) => {
			return filesArr;
		});
	};

	const handlePrimaryChange = (evt) => {
		const targetUrl = evt.currentTarget.children[0].src;
		const idx = imageUrls.findIndex((url) => url === targetUrl);
		console.log('handlePrimaryChange idx', idx);

		setImageUrls((imageUrls) => {
			const filteredUrls = imageUrls.filter(
				(url) => url !== targetUrl
			);
			filteredUrls.unshift(targetUrl);
			return filteredUrls;
		});

		console.log('handlePrimaryChange fileList', fileList);
		setFileList((fileList) => {
			return [
				fileList[idx],
				...fileList.slice(0, idx),
				...fileList.slice(idx + 1)
			];
		});
		console.log('handlePrimaryChange fileList post', fileList);
	};

	return (
		<Grid container className="ImagesInput">
			<Grid item>
				<Input
					accept="image/*"
					style={{ display: 'none' }}
					id="file-upload"
					type="file"
					inputProps={{ multiple: allowMultiple }}
					onChange={handleChange}
				/>
				<Button
					variant="outlined"
					color="primary"
					htmlFor="file-upload"
					component="label"
				>
					{allowMultiple ? 'Choose Images' : 'Choose Image'}
				</Button>
				{allowMultiple && (
					<Typography>
						If selecting multiple images, click the one you
						want to be the primary image.
					</Typography>
				)}
			</Grid>
			<Grid
				container
				item
				xs={12}
				justify="center"
				className={classes.imgsContainer}
			>
				{imageUrls.map((url, idx) => (
					<Box key={url} mr={1}>
						<Paper
							elevation={3}
							onClick={handlePrimaryChange}
							className={
								imageUrls[0] === url ? (
									`${classes.imgPaper} selected`
								) : (
									classes.imgPaper
								)
							}
						>
							<img
								className={classes.imgPreview}
								src={url}
							/>
						</Paper>
					</Box>
				))}
			</Grid>
		</Grid>
	);
}
export default React.memo(ImagesInput);
