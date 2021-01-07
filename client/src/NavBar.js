import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function a11yProps(index) {
	return {
		id              : `nav-tab-${index}`,
		'aria-controls' : `nav-tabpanel-${index}`
	};
}

function LinkTab(props) {
	return <Tab component={Link} {...props} />;
}
function DropdownTab(props) {}

const useStyles = makeStyles((theme) => ({
	root      : {
		flexGrow        : 1,
		backgroundColor : theme.palette.background.paper
	},
	indicator : {
		backgroundColor : theme.palette.primary.accent,
		height          : '3px'
	}
}));

function NavBar() {
	const classes = useStyles();
	const [ value, setValue ] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<nav className={classes.root}>
			<AppBar position="static">
				<Tabs
					variant="fullWidth"
					TabIndicatorProps={{ className: classes.indicator }}
					value={value}
					onChange={handleChange}
					aria-label="nav tabs example"
				>
					<LinkTab label="Home" to="/" {...a11yProps(0)} />
					<LinkTab
						label="Signup"
						to="/signup"
						{...a11yProps(1)}
					/>
					<LinkTab
						label="Create"
						to="/trees/new"
						{...a11yProps(2)}
					/>
				</Tabs>
			</AppBar>
		</nav>
	);
}

export default NavBar;
