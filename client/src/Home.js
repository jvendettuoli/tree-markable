import React from 'react';
import homeImg from './images/landing-page-main.jpg';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles({});

function Home() {
	const classes = useStyles();
	const theme = useTheme();

	return (
		<Grid
			container
			className={classes.image}
			style={{
				height             : '100%',
				backgroundImage    : `url(${homeImg})`,
				backgroundRepeat   : 'no-repeat',
				backgroundPosition : 'center',
				backgroundSize     : 'cover',
				backgroundColor    : theme.palette.secondary.dark
			}}
			alignItems="center"
		>
			<Grid item style={{ backgroundColor: 'rgba(0,0,0,.5)' }}>
				<Typography
					align="center"
					variant="h1"
					style={{ color: 'white', fontWeight: 'bold' }}
				>
					WELCOME TO TREE-MAKRABLE
				</Typography>
				<Typography
					align="center"
					variant="h2"
					style={{ color: 'white' }}
				>
					Explore
				</Typography>
				<Typography
					align="center"
					variant="h4"
					style={{ color: 'white' }}
				>
					Find remarkable trees near you or around the world!
				</Typography>
				<Typography
					align="center"
					variant="h2"
					style={{ color: 'white' }}
				>
					Share
				</Typography>
				<Typography
					align="center"
					variant="h4"
					style={{ color: 'white' }}
				>
					Add trees near you for others to enjoy!
				</Typography>
				<Typography
					align="center"
					variant="h2"
					style={{ color: 'white' }}
				>
					Collaborate
				</Typography>
				<Typography
					align="center"
					variant="h4"
					style={{ color: 'white' }}
				>
					Create or join groups to track specific trees for a
					purpose!
				</Typography>
			</Grid>
			<Grid item />
		</Grid>
	);
}
export default Home;
