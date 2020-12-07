import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import SignOut from './SignOut';
import Upload from './Upload';

function Routes() {
	return (
		<div className="Routes">
			<Switch>
				<Route exact path="/">
					<Home />
				</Route>
				<Route exact path="/signup">
					<Signup />
				</Route>
				<Route exact path="/login">
					<Login />
				</Route>
				<Route exact path="/signout">
					<SignOut />
				</Route>
				<Route exact path="/upload">
					<Upload />
				</Route>
			</Switch>
		</div>
	);
}

export default Routes;
