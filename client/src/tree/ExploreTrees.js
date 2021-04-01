import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import { getTrees } from '../actions/trees';
import TreeSearchForm from './TreeSearchForm';
import TreeList from './TreeList';
import LeafletMap from '../leafletMap/LeafletMap';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`map-list-tabpanel-${index}`}
			aria-labelledby={`map-list-tab-${index}`}
			{...other}
		>
			{value === index && <Box>{children}</Box>}
		</div>
	);
}

function a11yProps(index) {
	return {
		id              : `map-list-tab-${index}`,
		'aria-controls' : `map-list-tabpanel-${index}`
	};
}

const useStyles = makeStyles((theme) => ({
	indicator    : {
		backgroundColor : theme.palette.secondary.main
	},
	innerContent : {
		backgroundColor : theme.palette.background.paper,
		padding         : 20
	}
}));

function ExploreTrees() {
	const theme = useTheme();
	const classes = useStyles(theme);
	const dispatch = useDispatch();

	const [ isLoading, setIsLoading ] = useState(true);
	const [ value, setValue ] = useState(0);
	const [ centerOnUser, setCenterOnUser ] = useState(false);
	const [ mapCenter, setMapCenter ] = useState([ 48.09933034129291, -123.42563836030864 ]);

	// Changes visible panel between Map and List
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	// Get trees from API
	useEffect(
		() => {
			if (isLoading) {
				dispatch(getTrees());
				setIsLoading(false);
			}
		},
		[ isLoading, dispatch ]
	);

	let trees = useSelector((st) => Object.values(st.trees.entities).map((tree) => tree));

	if (isLoading) {
		return <div>Loading</div>;
	}

	return (
		<div className={classes.innerContent}>
			<TreeSearchForm mapCenter={mapCenter} setCenterOnUser={setCenterOnUser} />
			<AppBar position="static" color="default">
				<Tabs
					value={value}
					onChange={handleChange}
					indicatorColor="secondary"
					textColor="secondary"
					variant="fullWidth"
					aria-label="map and list view tabs"
				>
					<Tab label="Map" {...a11yProps(0)} />
					<Tab label="List" {...a11yProps(1)} />
				</Tabs>
			</AppBar>
			<Paper elevation={4}>
				<TabPanel value={value} index={0}>
					<LeafletMap
						mapCenter={mapCenter}
						setMapCenter={setMapCenter}
						useCenterOnUser={centerOnUser}
						setCenterOnUser={setCenterOnUser}
						trees={trees}
					/>
				</TabPanel>
				<TabPanel value={value} index={1}>
					<TreeList trees={trees} />
				</TabPanel>
			</Paper>
		</div>
	);
}
export default ExploreTrees;
