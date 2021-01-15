import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
	MapContainer,
	useMap,
	useMapEvents,
	Marker,
	Popup,
	TileLayer
} from 'react-leaflet';

import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import useStyles from './styles/leafletMap';

function ShowTreeMap({ tree }) {
	const classes = useStyles();

	const loadingPlaceholder = <CircularProgress />;

	return (
		<div className="ShowTreeMap">
			<MapContainer
				className={classes.mapContainer}
				placeholder={loadingPlaceholder}
				center={[ tree.geolocation.y, tree.geolocation.x ]}
				zoom={15}
				scrollWheelZoom={false}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
				/>
				<Marker
					position={[ tree.geolocation.y, tree.geolocation.x ]}
				/>
			</MapContainer>
		</div>
	);
}
export default ShowTreeMap;
