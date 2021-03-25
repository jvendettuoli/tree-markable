import React, { useState,useEffect } from 'react';

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
		// Style map search bar width to fit on mobile
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

/**
 * LeafletMap component handles the leaflet map and associated features.
 * 
 */
function LeafletMap({
	useGetClickCoordinates = false,
	useSearchComponent = true,
	useCenterOnUser = false,
	setCenterOnUser,
	zoomLevel=13,
	mapCenter=[
		48.09574762069073,
		-123.42439143699785
	],
	setMapCenter,
	onMapCoordinatesChange,
	trees = false,
	allowWheelZoom = true
}) {
	const classes = useStyles();
	const [ clickCoords, setClickCoords ] = useState(null);
	console.log('map trees', trees)
	useEffect(()=>{
		if(useCenterOnUser){
			setCenterOnUser(false)
		}
	},[useCenterOnUser, setCenterOnUser])

	// On Map click, gets coordinates and provides a marker showing
	// the coordinates.
	const GetClickCoordinates = () => {
		useMapEvents({
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

	//Center map view on user. Changes map center to user location.
	const CenterOnUser = () => {
		const map = useMap();
		map.locate({ setView: true });
		return null;
	};

	// Adds search control to Leaflet Map
	const SearchComponent = () => {
		const map = useMap();
		map.addControl(searchControl);
		return null;
	};

	// Update map center when dragging.
	const UpdateCenterOnDrag = () => {
		const map = useMapEvents({
			dragend() {
				console.log(map.getCenter())
				const coords = map.getCenter()
				setMapCenter([coords.lat, coords.lng]);
			},
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
			scrollWheelZoom={allowWheelZoom}

		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
			/>

			{useGetClickCoordinates && <GetClickCoordinates />}
			{useSearchComponent && <SearchComponent />}
			{useCenterOnUser && <CenterOnUser />}
			{setMapCenter && <UpdateCenterOnDrag/>}
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
