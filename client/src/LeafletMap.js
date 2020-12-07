import React, { useState } from 'react';

import {
	MapContainer,
	useMapEvents,
	Marker,
	Popup,
	TileLayer
} from 'react-leaflet';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
	mapContainer : {
		width  : '90%',
		height : '90vh'
	}
});

function LeafletMap() {
	const [ clickCoords, setClickCoords ] = useState([
		48.1181,
		-123.4307
	]);

	const classes = useStyles();

	function GetCoordinates() {
		const [ position, setPosition ] = useState(null);
		const map = useMapEvents({
			click(evt) {
				setClickCoords([ evt.latlng.lat, evt.latlng.lng ]);
				console.log('EVENT', evt.latlng);
			}
		});

		return position === null ? null : (
			<Marker position={position}>
				<Popup>You are here</Popup>
			</Marker>
		);
	}

	const loadingPlaceholder = <CircularProgress />;

	return (
		<MapContainer
			className={classes.mapContainer}
			placeholder={loadingPlaceholder}
			center={[ 48.1181, -123.4307 ]}
			zoom={13}
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
			/>
			<Marker position={clickCoords}>
				<Popup>{clickCoords}</Popup>
			</Marker>
			<GetCoordinates />
		</MapContainer>
	);
}
export default LeafletMap;
