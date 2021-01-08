import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

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
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

import useStyles from './styles/formStyle';

import { getTreesFromApi } from './actions/trees';
import SelectLocationMap from './SelectLocationMap';
import ImagesInput from './ImagesInput';

import {
	treesRef,
	downloadImageUrlsFromFirebase
} from './firebase/firebaseStorage';

function TreeMarker({ tree }) {
	const classes = useStyles();

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
				setImageUrls((imageUrls) => imgUrls);
				setIsLoading(false);
			};

			if (isLoading) {
				getImageUrls(treesRef, tree.id);
			}
		},
		[ isLoading, dispatch ]
	);

	const showPrimaryImage = () => {
		if (isLoading) {
			return <CircularProgress />;
		}
		else if (imageUrls.primary === '') {
			return 'No Images';
		}
		else {
			<img width="50px" height="auto" src={imageUrls.primary} />;
		}
	};

	return (
		<Grid container>
			<Grid item xs={12}>
				{tree.name}
			</Grid>

			<Grid item xs={12}>
				{`(${tree.geolocation.y}, ${tree.geolocation.x})`}
			</Grid>
			<Grid item xs={12}>
				{tree.common_name ? (
					`Common Name: ${tree.common_name}`
				) : (
					''
				)}
			</Grid>
			<Grid item xs={12}>
				{tree.scientific_name ? (
					`Scientific Name: ${tree.scientific_name}`
				) : (
					''
				)}
			</Grid>
			<Grid container item xs={12}>
				<Grid item xs={4}>
					<IconButton>
						<MessageIcon />
					</IconButton>
				</Grid>
				<Grid item xs={4}>
					<IconButton color="primary">
						<NatureIcon />
					</IconButton>
				</Grid>
				<Grid item xs={4}>
					<IconButton
						button
						color="primary"
						containerElement={
							<Link to={`/trees/${tree.id}`} />
						}
						linkButton={true}
					>
						<AddIcon />
					</IconButton>
				</Grid>
			</Grid>
		</Grid>
	);
}
export default TreeMarker;
