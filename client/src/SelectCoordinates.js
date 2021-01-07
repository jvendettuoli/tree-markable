import React, { useState, useRef, useEffect } from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import SelectLocationMap from './SelectLocationMap';

import {
	MapContainer,
	useMap,
	useMapEvents,
	Marker,
	Popup,
	TileLayer
} from 'react-leaflet';

import {
	GeoSearchControl,
	OpenStreetMapProvider
} from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
	mapContainer : {
		width  : '90%',
		height : '90vh'
	}
});

function SelectCoordinates({
	formData,
	onCoordinatesChange,
	onMapCoordinatesChange
}) {
	const classes = useStyles();
	const didMountRef = useRef(false);
	const [ showSelectMap, setShowSelectMap ] = useState(true);
	const [ mapCenter, setMapCenter ] = useState([
		48.09574762069073,
		-123.42439143699785
	]);
	const [ zoomLevel, setZoomLevel ] = useState(13);

	const handleChange = (evt) => {
		onCoordinatesChange(evt.target);
	};

	// Scroll to map when shown for selecting tree location
	// Ref to map toogle button, toggle dispays Leaflet map
	// and changes button text. Only runs on rerenders after first
	const mapToggleRef = useRef(null);
	useEffect(
		() => {
			if (
				showSelectMap &&
				mapToggleRef.current &&
				didMountRef.current
			) {
				mapToggleRef.current.scrollIntoView({
					behavior : 'smooth'
				});
			}
			else {
				didMountRef.current = true;
			}
		},
		[ showSelectMap ]
	);
	const toggleSelectMap = () => {
		setShowSelectMap(!showSelectMap);
	};
	const selectMapBtn = () => {
		return showSelectMap ? (
			<Typography>Hide Map</Typography>
		) : (
			<Typography>Select Via Map</Typography>
		);
	};
	const setDisplayMapStyle = () => {
		return showSelectMap ? {} : { display: 'none' };
	};

	return (
		<div>
			SelectCoordinates
			<Grid item container>
				<TextField
					id="lat"
					name="lat"
					label="Latitude"
					type="number"
					inputProps={{ step: 'any', min: -90, max: 90 }}
					InputLabelProps={{ shrink: true }}
					placeholder="-90 to 90 (eg. 48.10045)"
					onChange={handleChange}
					value={formData.lat}
					required
				/>
				<TextField
					id="lng"
					name="lng"
					label="Longitude"
					type="number"
					inputProps={{ step: 'any', min: -180, max: 180 }}
					InputLabelProps={{ shrink: true }}
					placeholder="-180 to 180 (eg. -123.45316)"
					onChange={handleChange}
					value={formData.lng}
					required
				/>
			</Grid>
			<Button
				variant="outlined"
				onClick={toggleSelectMap}
				ref={mapToggleRef}
			>
				{selectMapBtn()}
			</Button>
			<div style={setDisplayMapStyle()}>
				<SelectLocationMap
					mapCenter={mapCenter}
					setMapCenter={setMapCenter}
					zoomLevel={zoomLevel}
					setZoomLevel={setZoomLevel}
					onMapCoordinatesChange={onMapCoordinatesChange}
				/>
			</div>
		</div>
	);
}
export default React.memo(SelectCoordinates);