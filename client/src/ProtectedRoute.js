import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

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
