import React, { useState, useEffect } from 'react';

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
import TreeMarkableApi from './TreeMarkableApi';

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

function ShowTreesMap() {
	const classes = useStyles();
	const [ trees, setTrees ] = useState([]);
	const [ treeMarkers, setTreeMarkers ] = useState([]);
	const [ searchParams, setSearchParams ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(true);

	useEffect(
		() => {
			const getTrees = async (params) => {
				const trees = await TreeMarkableApi.getTrees(params);
				console.log('Trees', trees);
				setTrees(trees);
				setIsLoading(false);
			};
			getTrees(searchParams);
		},
		[ searchParams ]
	);

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

	const createMarkers = (items) => {
		return items.map((item) => {
			<Marker
				key={`marker-${item.id}`}
				position={[ item.geolocation.y, item.geolocation.y ]}
			>
				<Popup>{item.name}</Popup>
			</Marker>;
		});
	};

	if (isLoading) {
		return (
			<div
				style={{
					display        : 'flex',
					justifyContent : 'center',
					marginTop      : 80
				}}
			>
				<CircularProgress style={{ color: 'black' }} size={120} />
			</div>
		);
	}

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
			<SearchComponent />
			<CenterOnUser />
			{trees.map((tree) => (
				<Marker
					key={`marker-${tree.id}`}
					position={[ tree.geolocation.y, tree.geolocation.x ]}
				>
					<Popup>{tree.name}</Popup>
				</Marker>
			))}
		</MapContainer>
	);
}
export default ShowTreesMap;
