import React from 'react';
import {
	Link as RouterLink,
	useParams,
	useHistory
} from 'react-router-dom';
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

import profileHeaderImg from './images/profile-page-header.jpg';
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
		padding : 15
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

	const {
		uid,
		username,
		email,
		img_url,
		created_at,
		is_admin,
		savedTreeIds
	} = useSelector((st) => st.currUser);
	const trees = useSelector((st) => st.trees.trees);

	const pushToEditForm = () => {
		history.push(`/users/${username}/edit`);
	};

	return (
		<Grid container direction="column">
			<Grid
				className={classes.headerImgBackground}
				container
				justify="center"
				alignItems="flex-end"
				item
				xs={12}
			>
				<div style={{ height: 300 }} />
			</Grid>
			<Grid container item className={classes.innerContent}>
				<Grid>
					<CurrUserInfo />
					<Button color="secondary" onClick={pushToEditForm}>
						Edit User
					</Button>
				</Grid>
				<Grid container item>
					<Grid container alignItems="flex-end">
						<Box mr={2}>
							<Typography variant="h5">
								Favorite Trees
							</Typography>
						</Box>
						<Link component={RouterLink} to="/trees">
							<Typography variant="subtitle1">
								Find more trees!
							</Typography>
						</Link>
					</Grid>
					<List>
						{savedTreeIds.length > 0 ? (
							savedTreeIds.map((id) => (
								<ListItem
									button
									component={RouterLink}
									to={`/trees/${id}`}
								>
									<ListItemText>
										{trees[id].name}
									</ListItemText>
								</ListItem>
							))
						) : (
							<Grid>
								<Typography>No Favorite Trees</Typography>
							</Grid>
						)}
					</List>
				</Grid>
			</Grid>
		</Grid>
	);
}
export default UserProfilePage;
