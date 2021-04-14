// import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import UserList from './UserList';

function GroupMembersPanel({ isCreator, isModerator, group }) {
	console.log('GroupMembersPanel - Start');

	console.log('GroupMembersPanel', group);

	const admin = group.members.find((member) => member.user_id === group.creator);

	const moderators = group.members.filter(
		(member) => member.is_moderator === true && member.user_id !== group.creator
	);

	const members = group.members.filter((member) => member.is_moderator === false);

	console.log('GroupMembersPanel', admin, Boolean(moderators), members);

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
			{moderators.length ? (
				<UserList
					isCreator={isCreator}
					isModerator={isModerator}
					groupId={group.id}
					users={moderators}
					type={'mods'}
				/>
			) : (
				<Typography gutterBottom>No moderators in this group.</Typography>
			)}

			<Typography gutterBottom variant="h6">
				Members
			</Typography>
			{members.length ? (
				<UserList
					isCreator={isCreator}
					isModerator={isModerator}
					groupId={group.id}
					users={members}
					type={'members'}
				/>
			) : (
				<Typography gutterBottom>No members in this group.</Typography>
			)}
		</div>
	);
}
export default GroupMembersPanel;
