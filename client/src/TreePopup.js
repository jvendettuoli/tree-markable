import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { Nature as NatureIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';

import useStyles from './styles/markerCard';

import FavoriteIconBtn from './FavoriteIconBtn';

import {
	treesRef,
	downloadImageUrlsFromFirebase
} from './firebase/firebaseStorage';

function TreePopup({ tree }) {
	const classes = useStyles();

	const [ isLoading, setIsLoading ] = useState(true);
	const [ imageUrls, setImageUrls ] = useState({
		primary : '',
		album   : []
	});
	const isAuthenticated = useSelector((st) => st.auth.authenticated);
	const dispatch = useDispatch();

	// Get Image Urls to display tree image, if it exists
	useEffect(
		() => {
			const getImageUrls = async (collectionRef, id) => {
				const imgUrls = await downloadImageUrlsFromFirebase(
					collectionRef,
					id
				);
				if (imgUrls) {
					setImageUrls(imgUrls);
				}
				setIsLoading(false);
			};

			if (isLoading) {
				getImageUrls(treesRef, tree.id);
			}
		},
		[ isLoading, dispatch ]
	);

	// If tree has a primary image, show it on popup. Show
	// loading circle while retrieving image from storage.
	// Show nothing if no image is saved in storage
	const showPrimaryImage = () => {
		if (isLoading) {
			return (
				<Box display="flex" justifyContent="center">
					<CircularProgress />
				</Box>
			);
		}
		else if (imageUrls.primary === '') return '';
		else {
			return (
				<CardMedia
					className={classes.media}
					image={imageUrls.primary}
					title={`${tree.name}`}
				/>
			);
		}
	};

	return (
		<Card className={classes.root} elevation={0}>
			{showPrimaryImage()}
			<CardContent className={classes.content}>
				<Typography gutterBottom variant="h5" component="h2">
					{tree.name}
				</Typography>
				<Typography variant="body2" color="textSecondary">
					{tree.common_name}
				</Typography>
				<Typography
					variant="body2"
					color="textSecondary"
					component="i"
				>
					{tree.scientific_name}
				</Typography>
				<Typography
					variant="caption"
					color="textSecondary"
					component="p"
				>
					{`(${tree.geolocation.y.toFixed(
						5
					)}, ${tree.geolocation.x.toFixed(5)})`}
				</Typography>
			</CardContent>
			<CardActions className={classes.actions}>
				<Grid container justify="center">
					<Grid container justify="center" item xs={6}>
						<Tooltip title="Details">
							<IconButton
								component={Link}
								to={`/trees/${tree.id}`}
							>
								<NatureIcon color="primary" />
							</IconButton>
						</Tooltip>
					</Grid>
					{isAuthenticated && (
						<Grid container justify="center" item xs={6}>
							<FavoriteIconBtn treeId={tree.id} />
						</Grid>
					)}
				</Grid>
			</CardActions>
		</Card>
	);
}
export default TreePopup;
