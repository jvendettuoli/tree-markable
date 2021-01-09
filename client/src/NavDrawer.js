import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useTheme } from '@material-ui/core/styles';
import {
	Info as InfoIcon,
	Add as AddIcon,
	Nature as NatureIcon,
	Group as GroupIcon,
	Explore as ExploreIcon,
	Home as HomeIcon
} from '@material-ui/icons';

import useStyles from './styles/navDrawer';

function NavDrawer(props) {
	const { location: { pathname } } = props;

	const theme = useTheme();
	const classes = useStyles(theme);

	return (
		<div>
			<Paper
				className={classes.toolbar}
				style={{ backgroundColor: theme.palette.primary.main }}
				square
				elevation={5}
			/>
			<Divider />
			<List>
				<ListItem
					button
					component={Link}
					to="/"
					selected={'/' === pathname}
				>
					<ListItemIcon>
						<HomeIcon />
					</ListItemIcon>
					<ListItemText primary="Home" />
				</ListItem>
				<Divider />

				<ListItem>
					<ListItemIcon>
						<AddIcon />
					</ListItemIcon>
					<ListItemText primary="Create" />
				</ListItem>
				<List component="div" disablePadding>
					<ListItem
						button
						className={classes.nested}
						component={Link}
						to="/trees/new"
						selected={'/trees/new' === pathname}
					>
						<ListItemIcon>
							<NatureIcon />
						</ListItemIcon>
						<ListItemText primary="Trees" />
					</ListItem>
					<ListItem
						button
						className={classes.nested}
						component={Link}
						to="/groups/new"
						selected={'/groups/new' === pathname}
					>
						<ListItemIcon>
							<GroupIcon />
						</ListItemIcon>
						<ListItemText primary="Groups" />
					</ListItem>
				</List>
			</List>
			<Divider />
			<List>
				<ListItem>
					<ListItemIcon>
						<ExploreIcon />
					</ListItemIcon>
					<ListItemText primary="Explore" />
				</ListItem>
				<List component="div" disablePadding>
					<ListItem
						button
						className={classes.nested}
						component={Link}
						to="/trees"
						selected={'/trees' === pathname}
					>
						<ListItemIcon>
							<NatureIcon />
						</ListItemIcon>
						<ListItemText primary="Trees" />
					</ListItem>
					<ListItem
						button
						className={classes.nested}
						component={Link}
						to="/groups"
						selected={'/groups' === pathname}
					>
						<ListItemIcon>
							<GroupIcon />
						</ListItemIcon>
						<ListItemText primary="Groups" />
					</ListItem>
				</List>
				<Divider />
				<ListItem
					button
					component={Link}
					to="/about"
					selected={'/about' === pathname}
				>
					<ListItemIcon>
						<InfoIcon />
					</ListItemIcon>
					<ListItemText primary="About" />
				</ListItem>
			</List>
		</div>
	);
}

export default withRouter(NavDrawer);
