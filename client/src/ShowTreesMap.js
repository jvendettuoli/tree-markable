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

import {
	GeoSearchControl,
	OpenStreetMapProvider
} from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import TreePopup from './TreePopup';
import useStyles from './styles/leafletMap';

// Set up search provider for Leaflet map
const searchControl = new GeoSearchControl({
	position   : 'topright',
	showMarker : false,
	provider   : new OpenStreetMapProvider()
});

function ShowTreesMap({
	setMapCenter,
	mapCenter,
	zoomLevel,
	setGetLocation,
	getLocation,
	onGetLocationChange,
	trees
}) {
	const classes = useStyles();

	useEffect(
		() => {
			setGetLocation(false);
		},
		[ getLocation ]
	);

	const CenterOnUser = () => {
		const map = useMap();
		map.locate({ setView: true });
		return null;
	};

	const UpdateCenter = () => {
		const map = useMapEvents({
			moveend() {
				console.log('UpdateCenter - moveend');
				const coords = map.getCenter();
				setMapCenter([ coords.lat, coords.lng ]);
			}
		});
		return null;
	};

	const SearchComponent = () => {
		const map = useMap();
		map.addControl(searchControl);
		// map.on('geosearch/showlocation', () => {
		// 	console.log('Search Center update');
		// 	const coords = map.getCenter();
		// 	setMapCenter([ coords.lat, coords.lng ]);
		// });
		return null;
	};

	const loadingPlaceholder = <CircularProgress />;

	return (
		<div className="ShowTreesMap">
			<MapContainer
				className={classes.mapContainer}
				placeholder={loadingPlaceholder}
				center={mapCenter}
				zoom={zoomLevel}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
				/>
				<SearchComponent />
				{getLocation && <CenterOnUser />}
				<UpdateCenter />
				{trees.map((tree) => (
					<Marker
						key={`marker-${tree.id}`}
						position={[
							tree.geolocation.y,
							tree.geolocation.x
						]}
					>
						<Popup className={classes.treeMarkerPopup}>
							<TreePopup tree={tree} />
						</Popup>
					</Marker>
				))}
			</MapContainer>
		</div>
	);
}
export default ShowTreesMap;
