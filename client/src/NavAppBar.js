import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';

import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
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

function NavAppBar({ handleDrawerToggle, ...props }) {
	const { windo } = props;
	const theme = useTheme();
	const classes = useStyles(theme);
	const isLoggedIn = useSelector((st) => st.auth.authenticated);
	const dispatch = useDispatch();
	const [ anchorEl, setAnchorEl ] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		handleClose();
		dispatch(signOutUser());
	};

	return (
		<AppBar position="fixed" className={classes.appBar}>
			<Toolbar className={classes.toolbar}>
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
				{isLoggedIn ? (
					<div>
						<IconButton
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleMenu}
							color="inherit"
						>
							<AccountCircleIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical   : 'top',
								horizontal : 'right'
							}}
							keepMounted
							transformOrigin={{
								vertical   : 'top',
								horizontal : 'right'
							}}
							open={open}
							onClose={handleClose}
						>
							<MenuItem onClick={handleClose}>
								Profile
							</MenuItem>
							<MenuItem onClick={handleLogout}>
								Logout
							</MenuItem>
						</Menu>
					</div>
				) : (
					<div>
						<ButtonGroup size="small" variant="text">
							<Button
								style={{ color: 'white' }}
								component={Link}
								to="/signup"
							>
								Sign Up
							</Button>
							<Button
								style={{ color: 'white' }}
								component={Link}
								to="/signin"
							>
								Sign In
							</Button>
						</ButtonGroup>
					</div>
				)}
			</Toolbar>
		</AppBar>
	);
}

export default NavAppBar;
