import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function a11yProps(index) {
	return {
		id              : `nav-tab-${index}`,
		'aria-controls' : `nav-tabpanel-${index}`
	};
}

function LinkTab(props) {
	return <Tab component={Link} {...props} />;
}

const useStyles = makeStyles((theme) => ({
	root : {
		flexGrow        : 1,
		backgroundColor : theme.palette.background.paper
	}
}));

function NavBar() {
	const classes = useStyles();
	const [ value, setValue ] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Tabs
					variant="fullWidth"
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
					<LinkTab label="Login" to="/login" {...a11yProps(2)} />
					<LinkTab
						label="Sign Out"
						to="/signout"
						{...a11yProps(2)}
					/>
					<LinkTab
						label="Upload"
						to="/upload"
						{...a11yProps(2)}
					/>
				</Tabs>
			</AppBar>
		</div>
	);
}

export default NavBar;
