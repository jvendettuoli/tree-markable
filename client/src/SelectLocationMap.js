import React, { useState } from 'react';

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

// Set up search provider for Leaflet map
const searchControl = new GeoSearchControl({
	position : 'topright',
	provider : new OpenStreetMapProvider()
});

function SelectLocationMap({ setLocation }) {
	const [ clickCoords, setClickCoords ] = useState([
		48.1181,
		-123.4307
	]);

	const classes = useStyles();

	const GetClickCoordinates = () => {
		const [ position, setPosition ] = useState(null);
		const map = useMapEvents({
			click(evt) {
				setClickCoords([ evt.latlng.lat, evt.latlng.lng ]);
				setLocation({
					lat : evt.latlng.lat,
					lng : evt.latlng.lng
				});
				console.log('EVENT', evt.latlng);
			}
		});

		return position === null ? null : (
			<Marker position={position}>
				<Popup>You are here</Popup>
			</Marker>
		);
	};

	const CenterOnUser = () => {
		const map = useMap();
		map.locate({ setView: true });

		console.log('Mapcenter:', map.getCenter());

		return null;
	};

	const SearchComponent = () => {
		const map = useMap();
		map.addControl(searchControl);
		return null;
	};

	const loadingPlaceholder = <CircularProgress />;

	return (
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
			<Marker position={clickCoords}>
				<Popup>{clickCoords}</Popup>
			</Marker>
			<GetClickCoordinates />
			<SearchComponent />
			<CenterOnUser />
		</MapContainer>
	);
}
export default SelectLocationMap;
