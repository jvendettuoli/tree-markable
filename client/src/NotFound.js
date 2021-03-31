import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import lostWoods from './images/not-found-page.jpg';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
	return {
		backgroundImage : {
			backgroundImage              : `url(${lostWoods})`,
			backgroundRepeat             : 'no-repeat',
			backgroundPosition           : 'center',
			backgroundSize               : 'cover',
			backgroundColor              : 'black',
			height                       : `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
			[theme.breakpoints.up('md')]: {
				height : 'calc(100vh - 64px)'
			}
		}
	};
});

function NotFound() {
	const theme = useTheme();
	const classes = useStyles(theme);

	return (
		<Grid container className={classes.backgroundImage} alignItems="center">
			<Grid
				container
				item
				justify="center"
				direction="column"
				style={{ backgroundColor: 'rgba(0,0,0,.5)', paddingBottom: 10 }}
			>
				<Typography align="center" variant="h1" style={{ color: 'white', fontWeight: 'bold' }} gutterBottom>
					Page Not Found
				</Typography>
				<Typography align="center" variant="h5" style={{ color: 'white' }}>
					Did you get lost in the woods? Head back{' '}
					<Link component={RouterLink} to="/" style={{ color: theme.palette.primary.accent }}>
						home
					</Link>.
				</Typography>
			</Grid>
		</Grid>
	);
}
export default NotFound;
