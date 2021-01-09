import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter, useHistory } from 'react-router-dom';

import {
	MapContainer,
	useMap,
	useMapEvents,
	Marker,
	Popup,
	TileLayer
} from 'react-leaflet';

import {
	Info as InfoIcon,
	Add as AddIcon,
	Nature as NatureIcon,
	Group as GroupIcon,
	Explore as ExploreIcon,
	Home as HomeIcon,
	Message as MessageIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Box from '@material-ui/core/Box';

import useStyles from './styles/markerCard';

import { getTreesFromApi } from './actions/trees';
import SelectLocationMap from './SelectLocationMap';
import ImagesInput from './ImagesInput';

import {
	treesRef,
	downloadImageUrlsFromFirebase
} from './firebase/firebaseStorage';

function TreeMarker({ tree }) {
	const classes = useStyles();
	const history = useHistory();

	const [ isLoading, setIsLoading ] = useState(true);
	const [ imageUrls, setImageUrls ] = useState({
		primary : '',
		album   : []
	});

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

	// On add tree icon click, add tree to users saved trees
	const handleAddTreeClick = () => {
		console.log('savetree click');
	};

	const showPrimaryImage = () => {
		if (isLoading) {
			return (
				<Box display="flex" justifyContent="center">
					<CircularProgress />
				</Box>
			);
		}
		else if (imageUrls.primary === '') {
			return '';
		}
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
				<Grid container xs={12}>
					<Grid item xs={4}>
						<IconButton>
							<MessageIcon />
						</IconButton>
					</Grid>
					<Grid item xs={4}>
						<IconButton
							component={Link}
							to={`/trees${tree.id}`}
						>
							<NatureIcon color="primary" />
						</IconButton>
					</Grid>
					<Grid item xs={4}>
						<IconButton>
							<AddIcon />
						</IconButton>
					</Grid>
				</Grid>
			</CardActions>
		</Card>
	);
}
export default TreeMarker;
