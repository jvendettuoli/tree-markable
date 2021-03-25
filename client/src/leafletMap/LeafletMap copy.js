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
import TreePopup from './TreePopup';


const useStyles = makeStyles({
	mapContainer : {
		width  : '100%',
		height : '70vh',
		'& .open':{
			maxWidth: 280
		}
	}
});

// Set up search provider for Leaflet map
const searchControl = new GeoSearchControl({
	position   : 'topright',
	showMarker : false,
	provider   : new OpenStreetMapProvider()
});

function LeafletMap({
	useGetCoordinates = false,
	useSearchComponent = true,

	zoomLevel,
	setZoomLevel,
	mapCenter,
	setMapCenter,
	onMapCoordinatesChange,
	trees
}) {
	const classes = useStyles();
	const [ clickCoords, setClickCoords ] = useState(null);

	const GetClickCoordinates = () => {
		const map = useMapEvents({
			click(evt) {
				setClickCoords(evt.latlng);

				onMapCoordinatesChange({
					lat : evt.latlng.lat,
					lng : evt.latlng.lng
				});
				console.log('clickCoords', clickCoords);
			}
		});
		return clickCoords === null ? null : (
			<Marker position={clickCoords}>
				<Popup>Tree Geolocation: {`${clickCoords}`}</Popup>
			</Marker>
		);
	};
	const UpdateCenterAndZoom = () => {
		const map = useMapEvents({
			dragend() {
				setMapCenter(map.getCenter());
			},
			zoomend() {
				setZoomLevel(map.getZoom());
			}
		});
		return null;
	};

	const CenterOnUser = () => {
		const map = useMap();
		map.locate({ setView: false });

		return null;
	};

	const SearchComponent = () => {
		const map = useMap();
		map.addControl(searchControl);
		map.on('geosearch/showlocation', () => {
			console.log('Search End', map.getCenter(), map.getZoom());
			setMapCenter(map.getCenter());
			setZoomLevel(map.getZoom());
			console.log('map, soom', mapCenter, zoomLevel);
		});
		return null;
	};

	const loadingPlaceholder = <CircularProgress />;

	return (
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

			{useGetCoordinates && <GetClickCoordinates />}
			{useSearchComponent && <SearchComponent />}
			<UpdateCenterAndZoom />
			<CenterOnUser />
			{trees && trees.map((tree) => (
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
	);
}
export default React.memo(LeafletMap);
