import React from 'react';
import { Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import homeImg from './images/landing-page-main.jpg';
import searchTreesImg from './images/search-trees-snip.JPG';
import zIndex from '@material-ui/core/styles/zIndex';

const useStyles = makeStyles({
	imgPaper : {
		height    : 300,
		width     : 300,
		zIndex    : 1,
		position  : 'relative',
		boxShadow : `0px 11px 15px -7px rgba(0,0,0,0.10),
			0px 24px 38px 3px rgba(0,0,0,0.60),
			0px 9px 46px 8px rgba(0,0,0,0.51)`
	}
});

function LandingPageElement({ titleText, bodyText, imgSrc, imgAlt, imgSide = 'left', buttonLink, buttonText }) {
	const classes = useStyles();
	const theme = useTheme();

	const imgContainer = (
		<Grid container justify="center" item xs={12} md={6}>
			<Paper className={classes.imgPaper} elevation={10}>
				<Link to={`/${buttonLink}`}>
					<img height="300px" width="300px" alt={imgAlt} title={imgAlt} src={imgSrc} />
				</Link>
			</Paper>
		</Grid>
	);

	const textContainer = (
		<Grid
			container
			justify="center"
			alignItems="center"
			item
			xs={12}
			md={6}
			style={{
				paddingTop : theme.spacing(5)
			}}
		>
			<Grid container justify="center" item xs={12}>
				<Typography align="center" variant="h4" style={{ color: 'white' }} gutterBottom>
					{bodyText}
				</Typography>
			</Grid>
			<Grid container justify="center" item xs={12}>
				<Button component={Link} to={`/${buttonLink}`} variant="contained" color="primary" size="large">
					{buttonText}
				</Button>
			</Grid>
		</Grid>
	);

	return (
		<Grid
			container
			item
			justify="center"
			style={{
				paddingTop    : theme.spacing(5),
				paddingBottom : theme.spacing(8)
			}}
		>
			<Typography align="center" variant="h2" style={{ color: 'white' }} gutterBottom>
				{titleText}
			</Typography>
			<Hidden only={[ 'xs', 'sm', 'xl' ]} implementation="js">
				{imgSide === 'right' ? (
					<Grid container item xs={12}>
						{textContainer}
						{imgContainer}
					</Grid>
				) : (
					<Grid container item xs={12}>
						{imgContainer}
						{textContainer}
					</Grid>
				)}
			</Hidden>
			<Hidden only={[ 'md', 'lg' ]} implementation="js">
				<Grid container item xs={12}>
					<Grid container justify="center" item xs={12}>
						{imgContainer}
					</Grid>
					<Grid container justify="center" item xs={12}>
						{textContainer}
					</Grid>
				</Grid>
			</Hidden>
		</Grid>
	);
}
export default LandingPageElement;
