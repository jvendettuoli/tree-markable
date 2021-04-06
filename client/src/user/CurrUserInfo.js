import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useSelector } from 'react-redux';

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
	// const theme = useTheme();
	// const classes = useStyles(theme);

	const { username, email, created_at } = useSelector((st) => st.currUser);

	return (
		<Grid container item xs={12}>
			<Grid container direction="column">
				<Typography variant="h5">User Info</Typography>
				<Typography variant="subtitle1">Username: {username}</Typography>
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
