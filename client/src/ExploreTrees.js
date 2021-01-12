import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';

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

import { getTreesFromApi } from './actions/trees';
import ShowTreesMap from './ShowTreesMap';
import TreeSearchForm from './TreeSearchForm';
import TreeList from './TreeList';

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
	root      : {
		backgroundColor : theme.palette.background.paper,
		width           : '100%'
	},
	indicator : {
		backgroundColor : theme.palette.secondary.main
	}
}));

function ExploreTrees() {
	const theme = useTheme();
	const classes = useStyles(theme);
	const dispatch = useDispatch();
	let userUid = useSelector((st) => st.currUser.uid);

	const [ treeMarkers, setTreeMarkers ] = useState([]);
	const [ searchParams, setSearchParams ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ value, setValue ] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleChangeIndex = (index) => {
		setValue(index);
	};

	useEffect(
		() => {
			if (isLoading) {
				dispatch(getTreesFromApi());
				setIsLoading(false);
			}
		},
		[ isLoading, dispatch ]
	);

	let trees = useSelector((st) =>
		Object.values(st.trees).map((tree) => tree)
	);

	if (isLoading) {
		return <div>Loading</div>;
	}

	return (
		<div className={classes.root}>
			<TreeSearchForm />
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

			<TabPanel value={value} index={0}>
				<ShowTreesMap trees={trees} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<TreeList trees={trees} />
			</TabPanel>
		</div>
	);
}
export default ExploreTrees;
