import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import Paper from '@material-ui/core/Paper';

import LeafletMap from '../leafletMap/LeafletMap';
import TreeList from '../tree/TreeList';
import UserList from './UserList';
import GroupTreeEditTable from './GroupTreeEditTable';
import { getTreeFromApi } from '../actions/trees';

const useStyles = makeStyles((theme) => {
	return {
		tabPanel : {
			flexGrow        : 1,
			backgroundColor : 'white',
			// backgroundColor : theme.palette.background.paper,
			width           : '100%'
		},
		backdrop : {
			zIndex : theme.zIndex.drawer + 1,
			color  : '#fff'
		}
	};
});

function GroupMembersPanel({ isCreator, isModerator, group }) {
	console.log('GroupMembersPanel - Start');
	const theme = useTheme();
	const classes = useStyles(theme);
	const dispatch = useDispatch();
	const groupStatus = useSelector((st) => st.groups.status);

	console.log('GroupMembersPanel', group);

	const admin = group.members.find((member) => member.user_id === group.creator);

	const moderators = group.members.filter(
		(member) => member.is_moderator === true && member.user_id !== group.creator
	);

	const members = group.members.filter((member) => member.is_moderator === false);

	console.log('GroupMembersPanel', admin, moderators, members);

	//add remove moderator
	return (
		<div>
			<Typography gutterBottom variant="h6">
				Creator
			</Typography>
			<UserList groupId={group.id} users={[ admin ]} />

			<Typography gutterBottom variant="h6">
				Moderators
			</Typography>
			<UserList
				isCreator={isCreator}
				isModerator={isModerator}
				groupId={group.id}
				users={moderators}
				type={'mods'}
			/>

			<Typography gutterBottom variant="h6">
				Members
			</Typography>
			<UserList
				isCreator={isCreator}
				isModerator={isModerator}
				groupId={group.id}
				users={members}
				type={'members'}
			/>
		</div>
	);
}
export default GroupMembersPanel;
