import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import 'leaflet-geosearch/dist/geosearch.css';
import React, { useEffect, useRef, useState } from 'react';
import useStyles from '../styles/formStyle';
import LeafletMap from './LeafletMap';

function SelectCoordinates({ formData, onCoordinatesChange, onMapCoordinatesChange }) {
	const classes = useStyles();
	const didMountRef = useRef(false);
	const [ showSelectMap, setShowSelectMap ] = useState(true);

	// Handles change to coordinates from text input
	const handleChange = (evt) => {
		onCoordinatesChange(evt.target);
	};

	// Scroll to map when shown for selecting tree location
	// Ref to map toogle button, toggle dispays Leaflet map
	// and changes button text. Only runs on rerenders after first
	const mapToggleRef = useRef(null);
	useEffect(
		() => {
			if (showSelectMap && mapToggleRef.current && didMountRef.current) {
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
		return showSelectMap ? <Typography>Hide Map</Typography> : <Typography>Select Via Map</Typography>;
	};
	const setDisplayMapStyle = () => {
		return showSelectMap ? {} : { display: 'none' };
	};

	return (
		<div>
			<Grid item container ref={mapToggleRef}>
				<Grid item xs={12} md={6}>
					<TextField
						id="lat"
						name="lat"
						label="Latitude"
						type="number"
						inputProps={{ step: 'any', min: -90, max: 90 }}
						fullWidth
						InputLabelProps={{ shrink: true }}
						placeholder="-90 to 90 (eg. 48.10045)"
						onChange={handleChange}
						value={formData.lat}
						required
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField
						id="lng"
						name="lng"
						label="Longitude"
						type="number"
						inputProps={{ step: 'any', min: -180, max: 180 }}
						fullWidth
						InputLabelProps={{ shrink: true }}
						placeholder="-180 to 180 (eg. -123.45316)"
						onChange={handleChange}
						value={formData.lng}
						required
					/>
				</Grid>
			</Grid>
			<Button variant="outlined" color="secondary" fullWidth onClick={toggleSelectMap}>
				{selectMapBtn()}
			</Button>
			<div className={classes.mapContainer} style={setDisplayMapStyle()}>
				<LeafletMap onMapCoordinatesChange={onMapCoordinatesChange} useGetClickCoordinates={true} />
			</div>
		</div>
	);
}
export default React.memo(SelectCoordinates);
