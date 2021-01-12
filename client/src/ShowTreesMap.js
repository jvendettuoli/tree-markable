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
import TreeMarker from './TreeMarker';
import useStyles from './styles/leafletMap';

// Set up search provider for Leaflet map
const searchControl = new GeoSearchControl({
	position : 'topright',
	provider : new OpenStreetMapProvider()
});

function ShowTreesMap({ trees }) {
	const classes = useStyles();

	const CenterOnUser = () => {
		const map = useMap();
		map.locate({ setView: true });
		return null;
	};

	const SearchComponent = () => {
		const map = useMap();
		map.addControl(searchControl);
		return null;
	};

	const loadingPlaceholder = <CircularProgress />;

	return (
		<div className="ShowTreesMap">
			<MapContainer
				className={classes.mapContainer}
				placeholder={loadingPlaceholder}
				center={[ 48.09933034129291, -123.42563836030864 ]}
				zoom={13}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
				/>
				<SearchComponent />
				<CenterOnUser />
				{trees.map((tree) => (
					<Marker
						key={`marker-${tree.id}`}
						position={[
							tree.geolocation.y,
							tree.geolocation.x
						]}
					>
						<Popup className={classes.treeMarkerPopup}>
							<TreeMarker tree={tree} />
						</Popup>
					</Marker>
				))}
			</MapContainer>
		</div>
	);
}
export default ShowTreesMap;
