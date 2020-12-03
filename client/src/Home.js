import React from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({});

function Home() {
	const classes = useStyles();
	return (
		<Grid container className={classes.image}>
			Homepage
		</Grid>
	);
}
export default Home;
