import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Switch, Route, useHistory } from 'react-router-dom';

import LandingPage from './LandingPage';
import SignUp from './SignUp';
import SignIn from './SignIn';
import EditUser from './EditUser';
import CreateNewTree from './CreateNewTree';
import NotFound from './NotFound';
import ExploreTrees from './ExploreTrees';
import ExploreGroups from './ExploreGroups';
import TreePage from './TreePage';
import EditTree from './EditTree';
import CreateNewGroup from './CreateNewGroup';
import UserProfilePage from './UserProfilePage';
import GroupPage from './GroupPage';

function Routes() {
	const history = useHistory();
	const authErrorStatus = useSelector((st) => st.auth.error);
	const currUserErrorStatus = useSelector((st) => st.currUser.error);
	const groupsErrorStatus = useSelector((st) => st.groups.error);
	const treesErrorStatus = useSelector((st) => st.trees.error);
	const errorStatuses = [
		authErrorStatus,
		currUserErrorStatus,
		groupsErrorStatus,
		treesErrorStatus
	];

	useEffect(
		() => {
			console.log('ROUTES 404', errorStatuses);
			errorStatuses.forEach((error) => {
				if (error !== null && error[0].status === 404) {
					history.push('/404');
				}
			});
		},
		[
			authErrorStatus,
			currUserErrorStatus,
			groupsErrorStatus,
			treesErrorStatus
		]
	);

	return (
		<Switch>
			<Route exact path="/">
				<LandingPage />
			</Route>
			<Route exact path="/users/:username">
				<UserProfilePage />
			</Route>
			<Route exact path="/users/:username/edit">
				<EditUser />
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
			<Route exact path="/groups">
				<ExploreGroups />
			</Route>
			<Route exact path="/groups/new">
				<CreateNewGroup />
			</Route>
			<Route exact path="/groups/:id">
				<GroupPage />
			</Route>
			<Route exact path="/404">
				<NotFound />
			</Route>
			<Route>
				<NotFound />
			</Route>
		</Switch>
	);
}

export default Routes;
