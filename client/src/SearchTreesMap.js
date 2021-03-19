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

import TreePopup from './TreePopup';
import useStyles from './styles/leafletMap';

function ShowTreesMap({ trees }) {
	const classes = useStyles();

	const loadingPlaceholder = <CircularProgress />;

	return (
		<div className="s">
			<MapContainer
				className={classes.mapContainer}
				placeholder={loadingPlaceholder}
				center={[ trees[0].geolocation.y, trees[0].geolocation.x ]}
				zoom={15}
				scrollWheelZoom={false}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
				/>
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
