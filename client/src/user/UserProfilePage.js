import React from 'react';
import { Link as RouterLink, useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import profileHeaderImg from '../images/profile-page-header.jpg';
import CurrUserInfo from './CurrUserInfo';

const useStyles = makeStyles((theme) => ({
	accordianContainer  : {
		width : '100%'
	},
	heading             : {
		fontSize   : theme.typography.pxToRem(15),
		fontWeight : theme.typography.fontWeightRegular
	},
	headerImgBackground : {
		height             : 300,
		backgroundImage    : `url(${profileHeaderImg})`,
		backgroundRepeat   : 'no-repeat',
		backgroundPosition : 'center',
		backgroundSize     : 'cover',
		backgroundColor    : theme.palette.secondary.dark
	},
	innerContent        : {
		padding : 20
	},
	divider             : {
		width        : '90%',
		marginTop    : 10,
		marginBottom : 10
	}
}));

/**
 * Shows the current logged in user's profile. Allows use to edit
 * their information or delete their account.
 * 
 * 
 * If this is changed to allow users to view each other's profiles
 * in the future, then change getting user info from store and make
 * a request to the API for it. 
 */
function UserProfilePage() {
	const theme = useTheme();
	const classes = useStyles(theme);

	const history = useHistory();

	const { uid, username, email, img_url, created_at, is_admin, savedTreeIds, followedGroupIds } = useSelector(
		(st) => st.currUser
	);
	const favTrees = useSelector((st) =>
		Object.values(st.trees.entities).filter((tree) => savedTreeIds.includes(tree.id))
	);
	const userCreatedTrees = useSelector((st) =>
		Object.values(st.trees.entities).filter((tree) => tree.creator === uid)
	);
	const followedGroups = useSelector((st) =>
		Object.values(st.groups.entities).filter((group) => followedGroupIds.includes(group.id))
	);
	const userCreatedGroups = useSelector((st) =>
		Object.values(st.groups.entities).filter((group) => group.creator === uid)
	);

	// const favTrees = Object.values(userTrees).filter((tree) => savedTreeIds.includes(tree.id));
	const favGroups = useSelector((st) => st.groups.entities);

	const pushToEditForm = () => {
		history.push(`/users/${username}/edit`);
	};

	return (
		<Grid container direction="column">
			<Grid className={classes.headerImgBackground} container justify="center" alignItems="flex-end" item xs={12}>
				<div style={{ height: 300 }} />
			</Grid>
			<Grid container item className={classes.innerContent}>
				<Grid container item>
					<Grid item>
						<CurrUserInfo />
					</Grid>
					<Grid item>
						<Button color="secondary" variant="outlined" onClick={pushToEditForm}>
							Edit User
						</Button>
					</Grid>
				</Grid>

				<Divider className={classes.divider} />

				<Grid container item xs={12}>
					{/* User Created Trees */}
					<Grid container item xs={12} md={6} lg={3} direction="column">
						<Box mr={2}>
							<Typography variant="h5">My Trees</Typography>
						</Box>

						<List dense={true}>
							{userCreatedTrees.length > 0 ? (
								userCreatedTrees.map((tree) => (
									<ListItem
										button
										component={RouterLink}
										to={`/trees/${tree.id}`}
										key={`tree-${tree.id}`}
									>
										<ListItemText>{tree.name}</ListItemText>
									</ListItem>
								))
							) : (
								<Grid>
									<Typography>No Created Trees</Typography>
								</Grid>
							)}
						</List>
					</Grid>

					<Hidden smUp>
						<Divider className={classes.divider} />
					</Hidden>

					{/* User Favorite Trees */}
					<Grid container item xs={12} md={6} lg={3} direction="column">
						<Box mr={2}>
							<Typography variant="h5">Favorite Trees</Typography>
						</Box>

						<List dense={true}>
							{favTrees.length > 0 ? (
								favTrees.map((tree) => (
									<ListItem
										button
										component={RouterLink}
										to={`/trees/${tree.id}`}
										key={`tree-${tree.id}`}
									>
										<ListItemText>{tree.name}</ListItemText>
									</ListItem>
								))
							) : (
								<Grid>
									<Typography>No Favorite Trees</Typography>
								</Grid>
							)}
						</List>
					</Grid>

					<Hidden lgUp>
						<Divider className={classes.divider} />
					</Hidden>

					{/* User Created Groups */}
					<Grid container item xs={12} md={6} lg={3} direction="column">
						<Box mr={2}>
							<Typography variant="h5">My Groups</Typography>
						</Box>

						<List dense={true}>
							{userCreatedGroups.length > 0 ? (
								userCreatedGroups.map((group) => (
									<ListItem
										button
										component={RouterLink}
										to={`/groups/${group.id}`}
										key={`group-${group.id}`}
									>
										<ListItemText>{group.name}</ListItemText>
									</ListItem>
								))
							) : (
								<Grid>
									<Typography>No Created Groups</Typography>
								</Grid>
							)}
						</List>
					</Grid>

					<Hidden smUp>
						<Divider className={classes.divider} />
					</Hidden>

					{/* User Followed Groups */}
					<Grid container item xs={12} md={6} lg={3} direction="column">
						<Box mr={2}>
							<Typography variant="h5">Followed Groups</Typography>
						</Box>

						<List dense={true}>
							{followedGroups.length > 0 ? (
								followedGroups.map((group) => (
									<ListItem
										button
										component={RouterLink}
										to={`/groups/${group.id}`}
										key={`group-${group.id}`}
									>
										<ListItemText>{group.name}</ListItemText>
									</ListItem>
								))
							) : (
								<Grid>
									<Typography>No Followed Groups</Typography>
								</Grid>
							)}
						</List>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
export default UserProfilePage;
