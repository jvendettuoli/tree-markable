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

import { getGroups } from '../actions/groups';
import GroupSearchForm from './GroupSearchForm';
import GroupList from './GroupList';

const useStyles = makeStyles((theme) => ({
	innerContent : {
		backgroundColor : theme.palette.background.paper,
		padding         : 20
	}
}));

function ExploreGroups() {
	const theme = useTheme();
	const classes = useStyles(theme);
	const dispatch = useDispatch();

	const [ isLoading, setIsLoading ] = useState(true);

	useEffect(
		() => {
			if (isLoading) {
				dispatch(getGroups());
				setIsLoading(false);
			}
		},
		[ isLoading, dispatch ]
	);

	let groups = useSelector((st) => Object.values(st.groups.entities).map((group) => group));

	console.log('ExploreGroups - groups', groups);

	if (isLoading) {
		return <div>Loading</div>;
	}

	return (
		<div className={classes.innerContent}>
			<GroupSearchForm />

			<GroupList groups={groups} />
		</div>
	);
}
export default ExploreGroups;
