import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

/** 
 * Wrapper Component for Route. Ensures that the user is autheticated
 * and is allowed to view the page before passing private component. 
 * If unauthenticated or the incorrect user, they are redirected 
 * to the login page, trees page, or groups page.
*/
const PrivateUserRoute = ({ component: Component, ...rest }) => {
	const { location: { pathname } } = rest;

	const [ blank, type, id ] = pathname.split('/');

	const username = useSelector((st) => st.currUser.username);
	const isUser = username === id;

	return <Route {...rest} render={(props) => (isUser ? <Component {...props} /> : <Redirect to="/signin" />)} />;
};

export default PrivateUserRoute;
