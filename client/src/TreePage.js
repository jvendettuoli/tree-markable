import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import useStyles from './styles/formStyle';

import { getTreesFromApi } from './actions/trees';
import SelectLocationMap from './SelectLocationMap';
import ImagesInput from './ImagesInput';
import {
	treesRef,
	downloadImageUrlsFromFirebase
} from './firebase/firebaseStorage';

function TreePage() {
	const classes = useStyles();
	const { id } = useParams();

	const [ isLoading, setIsLoading ] = useState(true);
	const [ imageUrls, setImageUrls ] = useState({
		primary : '',
		album   : []
	});

	const dispatch = useDispatch();

	useEffect(
		() => {
			const getImageUrls = async (collectionRef, id) => {
				const imgUrls = await downloadImageUrlsFromFirebase(
					collectionRef,
					id
				);
				console.log('imgUrls', imgUrls);
				if (imgUrls) {
					setImageUrls(imgUrls);
				}
				setIsLoading(false);
			};

			if (isLoading) {
				getImageUrls(treesRef, id);
			}
		},
		[ isLoading, dispatch ]
	);

	if (isLoading) {
		return <div>Loading</div>;
	}

	const displayAnyImages = (imageUrls) => {
		console.log('imageUrls', imageUrls);
		if (imageUrls.primary === '') return 'No primary Images';
		else if (imageUrls.album.length === 0) {
			return;
		}
		else {
			return (
				<div>
					<img src={imageUrls.primary} />
					{imageUrls.album.map((imageUrl, idx) => (
						<img key={`album-${idx}`} src={imageUrl} />
					))}
				</div>
			);
		}
	};

	return (
		<div className={classes.root}>
			Tree Images{displayAnyImages(imageUrls)}
		</div>
	);
}
export default TreePage;
