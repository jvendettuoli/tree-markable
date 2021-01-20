import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Upload from './UploadImagesToFirebase';
import CreateNewTree from './CreateNewTree';
import NotFound from './NotFound';
import ExploreTrees from './ExploreTrees';
import TreePage from './TreePage';
import EditTree from './EditTree';
import CreateNewGroup from './CreateNewGroup';

function Routes() {
	return (
		<Switch>
			<Route exact path="/">
				<Home />
			</Route>
			<Route exact path="/signup">
				<SignUp />
			</Route>
			<Route exact path="/signin">
				<SignIn />
			</Route>
			<Route exact path="/upload">
				<Upload />
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
