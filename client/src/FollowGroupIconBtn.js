import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
	Group as GroupIcon,
	PeopleOutline as PeopleOutlineIcon
} from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useTheme } from '@material-ui/core/styles';

import {
	addToFollowedGroups,
	removeFromFollowedGroups
} from './actions/currUser';

function FollowGroupIconBtn({ groupId }) {
	const theme = useTheme();
	const [ isFollowed, setIsFollowed ] = useState(null);
	const username = useSelector((st) => st.currUser.username);
	const followedGroupIds = useSelector(
		(st) => st.currUser.followedGroupIds
	);
	const dispatch = useDispatch();

	useEffect(
		() => {
			const checkFollowStatus = (groupId, followedGroupIds) => {
				setIsFollowed(followedGroupIds.includes(groupId));
			};
			checkFollowStatus(groupId, followedGroupIds);
		},
		[ followedGroupIds, groupId ]
	);

	const handleClick = async () => {
		if (isFollowed) {
			dispatch(removeFromFollowedGroups(username, groupId));
		}
		else {
			dispatch(addToFollowedGroups(username, groupId));
		}
		setIsFollowed(!isFollowed);
	};

	return (
		<Tooltip title={isFollowed ? 'Unfollow' : 'Follow'}>
			<IconButton onClick={handleClick}>
				{isFollowed ? (
					<GroupIcon htmlColor={theme.palette.primary.light} />
				) : (
					<PeopleOutlineIcon
						htmlColor={theme.palette.primary.light}
					/>
				)}
			</IconButton>
		</Tooltip>
	);
}
export default FollowGroupIconBtn;
