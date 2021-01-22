import React from 'react';
import { Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import homeImg from './images/landing-page-main.jpg';
import searchTreesImg from './images/search-trees-snip.JPG';
import shareTreesImg from './images/share-trees.jpg';
import LandingPageElement from './LandingPageElement';

const useStyles = makeStyles((theme) => {
	return {
		backgroundImage : {
			height               : '100%',
			backgroundImage      : `url(${homeImg})`,
			backgroundAttachment : 'fixed',
			backgroundRepeat     : 'no-repeat',
			backgroundPosition   : 'center',
			backgroundSize       : 'cover',
			backgroundColor      : theme.palette.secondary.dark
		}
	};
});

function LandingPage() {
	const theme = useTheme();
	const classes = useStyles(theme);

	const lightDivider = (
		<Grid item xs={12}>
			<Divider
				flexItem
				style={{
					height          : 2,
					backgroundColor : 'rgba(255,255,255, .5)'
				}}
				variant="middle"
			/>
		</Grid>
	);

	return (
		<Grid
			container
			className={classes.backgroundImage}
			alignItems="stretch"
		>
			<Grid
				container
				item
				style={{
					backgroundColor : 'rgba(0,0,0,.5)',
					paddingTop      : theme.spacing(10),
					paddingRight    : theme.spacing(3),
					paddingLeft     : theme.spacing(3)
				}}
			>
				<Grid
					container
					item
					style={{
						marginBottom : theme.spacing(10)
					}}
					justify="center"
				>
					<Typography
						align="center"
						variant="h1"
						style={{ color: 'white', fontWeight: 'bold' }}
					>
						WELCOME TO TREE-MARKABLE
					</Typography>
				</Grid>
				{lightDivider}
				<Hidden xlUp>
					<LandingPageElement
						titleText="Explore"
						bodyText="Find remarkable trees near you or around the
							world!"
						imgSrc={searchTreesImg}
						imgAlt="search trees map"
						buttonLink="trees"
						buttonText="Search Trees"
					/>
					{lightDivider}
					<LandingPageElement
						titleText="Share"
						bodyText="Add your favorite trees for others to enjoy!"
						imgSrc={shareTreesImg}
						imgAlt="large tree photo by Rob Mulally"
						imgSide="right"
						buttonLink="trees/new"
						buttonText="Create a Tree"
					/>
					{lightDivider}
					<LandingPageElement
						titleText="Collaborate"
						bodyText="Create or join groups to track specific trees for a
				purpose!"
						imgSrc={searchTreesImg}
						imgAlt=""
						buttonLink="groups"
						buttonText="Search Groups"
					/>
				</Hidden>
				<Hidden lgDown>
					<Grid container>
						<Grid item xs={4}>
							<LandingPageElement
								titleText="Explore"
								bodyText="Find remarkable trees near you or around the
							world!"
								imgSrc={searchTreesImg}
								imgAlt="search trees map"
								buttonLink="trees"
								buttonText="Search Trees"
							/>
						</Grid>
						<Grid item xs={4}>
							<LandingPageElement
								titleText="Share"
								bodyText="Add your favorite trees for others to enjoy!"
								imgSrc={shareTreesImg}
								imgAlt="large tree photo by Rob Mulally"
								imgSide="right"
								buttonLink="trees/new"
								buttonText="Create a Tree"
							/>
						</Grid>
						<Grid item xs={4}>
							<LandingPageElement
								titleText="Collaborate"
								bodyText="Create or join groups to track specific trees for a
				purpose!"
								imgSrc={searchTreesImg}
								imgAlt=""
								buttonLink="groups"
								buttonText="Search Groups"
							/>
						</Grid>
					</Grid>
				</Hidden>
			</Grid>
		</Grid>
	);
}
export default LandingPage;
