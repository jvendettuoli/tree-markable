import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import SignUp from './SignUp';
import Login from './Login';
import SignOut from './SignOut';
import Upload from './Upload';
import LeafletMap from './SelectLocationMap';
import TreeForm from './TreeForm';
import ShowTreesMap from './ShowTreesMap';

function Routes() {
	return (
		<div className="Routes">
			<Switch>
				<Route exact path="/">
					<Home />
					<ShowTreesMap />
				</Route>
				<Route exact path="/signup">
					<SignUp />
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
				<Route exact path="/map">
					<TreeForm />
				</Route>
			</Switch>
		</div>
	);
}

export default Routes;
