import React from 'react';
import { Switch, Route } from 'react-router-dom';

import LandingPage from './LandingPage';
import SignUp from './SignUp';
import SignIn from './SignIn';
import CreateNewTree from './CreateNewTree';
import NotFound from './NotFound';
import ExploreTrees from './ExploreTrees';
import TreePage from './TreePage';
import EditTree from './EditTree';
import CreateNewGroup from './CreateNewGroup';
import UserProfilePage from './UserProfilePage';

function Routes() {
	return (
		<Switch>
			<Route exact path="/">
				<LandingPage />
			</Route>
			<Route exact path="/users/:id">
				<UserProfilePage />
			</Route>
			<Route exact path="/signup">
				<SignUp />
			</Route>
			<Route exact path="/signin">
				<SignIn />
			</Route>
			<Route exact path="/trees">
				<ExploreTrees />
			</Route>
			<Route exact path="/trees/new">
				<CreateNewTree />
			</Route>
			<Route exact path="/trees/:id">
				<TreePage />
			</Route>
			<Route exact path="/trees/:id/edit">
				<EditTree />
			</Route>
			<Route exact path="/groups/new">
				<CreateNewGroup />
			</Route>
			<Route>
				<NotFound />
			</Route>
		</Switch>
	);
}

export default Routes;
