import React from 'react';
import {
	Link as RouterLink,
	useParams,
	useHistory
} from 'react-router-dom';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import profileHeaderImg from '../images/profile-page-header.jpg';

const useStyles = makeStyles((theme) => ({
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
	}
}));

/**
 * Shows the current logged in user's profile. Allows user to edit
 * their information or delete their account.
 * 
 * 
 * If this is changed to allow users to view each other's profiles
 * in the future, then change getting user info from store and make
 * a request to the API for it. 
 */
function CurrUserInfo() {
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
		savedTreeIds,
		groupIds
	} = useSelector((st) => st.currUser);
	
	const handleEdit = (evt) => {
		history.push(`/users/${username}/edit`);
	};

	return (
		<Grid container item xs={12}>
			<Grid container direction="column">
				<Typography variant="h5">User Info</Typography>
				<Typography variant="subtitle1">
					Username: {username}
				</Typography>
				<Typography variant="subtitle1">Email: {email}</Typography>
				<Typography variant="subtitle1">
					Joined:{' '}
					{new Date(created_at).toLocaleDateString('en-gb', {
						year  : 'numeric',
						month : 'long',
						day   : 'numeric'
					})}
				</Typography>
			</Grid>
		</Grid>
	);
}
export default CurrUserInfo;
