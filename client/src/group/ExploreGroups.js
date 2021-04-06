import { makeStyles, useTheme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGroups } from '../actions/groups';
import GroupList from './GroupList';
import GroupSearchForm from './GroupSearchForm';

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
