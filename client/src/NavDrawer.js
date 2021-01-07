import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';

// import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {
	Mail as MailIcon,
	Menu as MenuIcon,
	MoveToInbox as InboxIcon,
	Info as InfoIcon,
	Add as AddIcon,
	Nature as NatureIcon,
	Group as GroupIcon,
	GroupAdd as GroupAddIcon,
	Search as SearchIcon,
	Explore as ExploreIcon,
	AccountCircle as AccountCircleIcon,
	Home as HomeIcon
} from '@material-ui/icons';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';

import useStyles from './styles/navDrawer';

function NavDrawer(props) {
	const { window, location: { pathname } } = props;
	const children = props.children;
	const theme = useTheme();
	const classes = useStyles(theme);
	const [ mobileOpen, setMobileOpen ] = useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const drawer = (
		<div>
			<Paper
				className={classes.toolbar}
				style={{ backgroundColor: theme.palette.primary.main }}
				square
				elevation={3}
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

	const container =
		window !== undefined ? () => window().document.body : undefined;

	console.log('CONTAINER', container);
	return (
		<div className={classes.root}>
			<AppBar position="fixed" className={classes.appBar}>
				{/* <CssBaseline /> */}
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						className={classes.menuButton}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap>
						Tree-Markable
					</Typography>
				</Toolbar>
			</AppBar>
			<nav className={classes.drawer} aria-label="navigation drawer">
				<Hidden smUp implementation="js">
					<Drawer
						container={container}
						variant="temporary"
						anchor={
							theme.direction === 'rtl' ? 'right' : 'left'
						}
						open={mobileOpen}
						onClose={handleDrawerToggle}
						classes={{
							paper : classes.drawerPaper
						}}
						ModalProps={{
							keepMounted : true // Better open performance on mobile.
						}}
					>
						{drawer}
					</Drawer>
				</Hidden>
				<Hidden xsDown implementation="js">
					<Drawer
						classes={{
							paper : classes.drawerPaper
						}}
						variant="permanent"
						open
					>
						{drawer}
					</Drawer>
				</Hidden>
			</nav>
			<main className={classes.content}>
				<div className={classes.toolbar} />
				{children}
			</main>
		</div>
	);
}

export default withRouter(NavDrawer);
