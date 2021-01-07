import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';

import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {
	Menu as MenuIcon,
	AccountCircle as AccountCircleIcon
} from '@material-ui/icons';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';

import useStyles from './styles/navDrawer';
import { signOutUser } from './actions/auth';
import NavDrawer from './NavDrawer';
import NavAppBar from './NavAppBar';

function Navigation(props) {
	const { window } = props;
	const children = props.children;
	const theme = useTheme();
	const classes = useStyles(theme);
	const [ mobileOpen, setMobileOpen ] = useState(false);
	const isLoggedIn = useSelector((st) => st.auth.authenticated);
	const dispatch = useDispatch();
	const [ anchorEl, setAnchorEl ] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<div className={classes.root}>
			<NavAppBar handleDrawerToggle={handleDrawerToggle} />
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
						<NavDrawer />
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
						<NavDrawer />
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

export default Navigation;
