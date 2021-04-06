import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addModToGroup, removeMemberFromGroup, removeModFromGroup } from '../actions/groups';

const useStyles = makeStyles((theme) => ({
	button   : {
		marginTop    : 5,
		marginBottom : 5
	},
	userInfo : {
		display    : 'flex',
		alignItems : 'center'
	},
	listItem : {
		display                      : 'flex',
		flexDirection                : 'column',
		alignItems                   : 'flex-start',

		[theme.breakpoints.up('md')]: {
			display        : 'flex',
			flexDirection  : 'row',
			justifyContent : 'space-between'
		}
	}
	// style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
}));

/**
 * List of provided array of users. Showing user pic/icon, Name, and 
 * optional additions such as add/remove user button.
 */
function UserList({ isCreator, isModerator, groupId, users, type }) {
	const theme = useTheme();
	const dispatch = useDispatch();
	const classes = useStyles(theme);
	const isAuthorized = useSelector((st) => st.auth.authenticated);

	const actionBtns = (type, userId) => {
		if (!isAuthorized) return null;
		if (isCreator && type === 'mods') {
			return (
				<Button
					className={classes.button}
					size="small"
					color="secondary"
					variant="contained"
					onClick={() => dispatch(removeModFromGroup(groupId, userId))}
				>
					Remove As Mod
				</Button>
			);
		}
		else if (type === 'members')
			return (
				<div>
					{isModerator && (
						<Button
							className={classes.button}
							style={{ marginRight: 5 }}
							size="small"
							color="secondary"
							variant="contained"
							onClick={() => dispatch(removeMemberFromGroup(groupId, userId))}
						>
							Remove Member
						</Button>
					)}
					{isCreator && (
						<Button
							className={classes.button}
							size="small"
							color="primary"
							variant="contained"
							onClick={() => dispatch(addModToGroup(groupId, userId))}
						>
							Add As Mod
						</Button>
					)}
				</div>
			);
		else return null;
	};

	return (
		<List dense={true}>
			{users.map((user) => (
				<ListItem key={user.username} className={classes.listItem} divider>
					<div className={classes.userInfo}>
						<ListItemAvatar>
							<Avatar>{user.username[0]}</Avatar>
						</ListItemAvatar>
						<ListItemText primary={user.username} />
					</div>
					<div style={{ display: 'flex' }}>{actionBtns(type, user.user_id)}</div>
				</ListItem>
			))}
		</List>
	);
}
export default UserList;
