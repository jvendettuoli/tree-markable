import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import lostWoods from './images/not-found-page.jpg';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
	return {
		innerContent : {
			padding  : 20,
			'& > h5' : {
				marginTop : 10
			},
			'& > p'  : {
				marginLeft : 20
			}
		}
	};
});

function About() {
	const theme = useTheme();
	const classes = useStyles(theme);

	return (
		<Grid container className={classes.innerContent} direction="column">
			<Typography align="center" variant="h3" style={{ fontWeight: 'bold' }} gutterBottom>
				About Tree-Markable
			</Typography>
			<Typography variant="h5" gutterBottom>
				What is Tree-Markable?
			</Typography>
			<Typography gutterBottom>
				Tree-Markable began as an idea inspired by some of the amazing ways in which local communities enable
				their residents to have meaningful engagement with their local urban forest.
			</Typography>
			<Typography gutterBottom>
				Users can share trees that they find remarkable to give some recognition to the silent heroes that do so
				much for our communities through ecosystem services, climate change resilience, and their intrinsic
				value. Users can also make and join groups for more specific purposes or collections of trees such as
				for neighborhoods, national champion trees, favorite species, etc.
			</Typography>
			<Typography gutterBottom>
				Anyone can search through the shared trees or groups, but signing up with Tree-Markable (no cost or
				spam) allows you to share your own, join groups, and comment on trees or groups.
			</Typography>
			<Typography variant="h5" gutterBottom>
				Who made Tree-Markable?
			</Typography>
			<Typography gutterBottom>
				Tree-Markable is a personal, open source project by the Clallam Tree Alliance, and as such is an
				evolving project that is subject to change in the future. This web app was created with the goal of
				enabling anyone interested in finding and sharing remarkable trees with their local communities and the
				world at large. Check the{' '}
				<Link
					href="https://github.com/jvendettuoli/tree-markable"
					rel="norefferer"
					target="_blank"
					style={{ color: theme.palette.primary.light }}
				>
					GitHub
				</Link>{' '}
				for the project if you are interested in the technology used, or seeing the features that are planned
				for the future, like paths to add tree walks, expanded image handling, custom map markers, and more!
			</Typography>
			<Typography variant="h5" gutterBottom>
				What is the{' '}
				<Link
					href="https://www.facebook.com/clallamtreealliance"
					rel="norefferer"
					target="_blank"
					style={{ color: theme.palette.primary.light }}
				>
					Clallam Tree Alliance
				</Link>?
			</Typography>
			<Typography gutterBottom>
				Clallam Tree Alliance started as a group of individuals looking to form an officially recognized tree
				board for the City of Port Angeles, WA. After some assessment and evolution of priorities, we are now a
				group of dedicated volunteers that aims to strengthen our understanding and deepen our appreciation of
				the economic, social, environmental and aesthetic gifts that trees bring to our lives. We hold planting
				events to increase the cover of native plants and trees within the city, engage with the public and
				local policy makers about the importance of a healthy urban forest canopy, and occasionally donate happy
				plants to loving homes.
			</Typography>
			<Typography align="center" variant="h4" gutterBottom style={{ marginTop: 15 }} color="primary">
				We hope you enjoy sharing and exploring remarkable trees, and be sure to check back in as this project
				grows from a sapling to a full-fledged tree!
			</Typography>
		</Grid>
	);
}
export default About;
