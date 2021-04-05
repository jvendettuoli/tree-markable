import React from 'react';
import { Route, Redirect, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

/** 
 * Wrapper Component for Route. Ensures that the user is autheticated
 * before passing protected component. If unauthenticated the user 
 * is redirected to the login page.
*/
const ProtectedRoute = ({ component: Component, ...rest }) => {
	const uid = useSelector((st) => st.currUser.uid);
	return <Route {...rest} render={(props) => (uid ? <Component {...props} /> : <Redirect to="/signin" />)} />;
};

export default ProtectedRoute;
