import React from 'react';
import { Route, Switch } from 'react-router-dom';
import About from './About';
import CreateNewGroup from './group/CreateNewGroup';
import EditGroup from './group/EditGroup';
import ExploreGroups from './group/ExploreGroups';
import GroupPage from './group/GroupPage';
import LandingPage from './LandingPage';
import NotFound from './NotFound';
import PrivateEntityRoute from './PrivateEntityRoute';
import PrivateUserRoute from './PrivateUserRoute';
import ProtectedRoute from './ProtectedRoute';
import CreateNewTree from './tree/CreateNewTree';
import EditTree from './tree/EditTree';
import ExploreTrees from './tree/ExploreTrees';
import TreePage from './tree/TreePage';
import EditUser from './user/EditUser';
import SignIn from './user/SignIn';
import SignUp from './user/SignUp';
import UserProfilePage from './user/UserProfilePage';

function Routes() {
	// const history = useHistory();
	// const authErrorStatus = useSelector((st) => st.auth.error);
	// const currUserErrorStatus = useSelector((st) => st.currUser.error);
	// const groupsErrorStatus = useSelector((st) => st.groups.error);
	// const treesErrorStatus = useSelector((st) => st.trees.error);
	// const errorStatuses = [ authErrorStatus, currUserErrorStatus, groupsErrorStatus, treesErrorStatus ];

	// useEffect(
	// 	() => {
	// 		console.log('ROUTES 404', errorStatuses);
	// 		errorStatuses.forEach((error) => {
	// 			if (error !== null && error[0].status === 404) {
	// 				history.push('/404');
	// 			}
	// 		});
	// 	},
	// 	[
	// 		authErrorStatus,
	// 		currUserErrorStatus,
	// 		groupsErrorStatus,
	// 		treesErrorStatus
	// 	]
	// );

	return (
		<Switch>
			<Route exact path="/">
				<LandingPage />
			</Route>
			<Route exact path="/about">
				<About />
			</Route>
			<PrivateUserRoute component={UserProfilePage} exact path="/users/:username" />
			<PrivateUserRoute component={EditUser} exact path="/users/:username/edit" />
			<Route exact path="/signup">
				<SignUp />
			</Route>
			<Route exact path="/signin">
				<SignIn />
			</Route>
			<Route exact path="/trees">
				<ExploreTrees />
			</Route>
			<ProtectedRoute component={CreateNewTree} exact path="/trees/new" />
			<Route exact path="/trees/:id">
				<TreePage />
			</Route>
			<PrivateEntityRoute component={EditTree} exact path="/trees/:id/edit" />
			<Route exact path="/groups">
				<ExploreGroups />
			</Route>
			<ProtectedRoute component={CreateNewGroup} exact path="/groups/new" />
			<Route exact path="/groups/:id">
				<GroupPage />
			</Route>
			<PrivateEntityRoute component={EditGroup} exact path="/groups/:id/edit" />
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
