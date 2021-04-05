import React from 'react';
import { Route, Redirect, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

/** 
 * Wrapper Component for Route. Ensures that the user is autheticated
 * and is allowed to view the page before passing private component. 
 * If unauthenticated or the incorrect user, they are redirected 
 * to the login page, trees page, or groups page.
*/
const PrivateUserRoute = ({ component: Component, ...rest }) => {
	const { location: { pathname } } = rest;
	console.log('PATHNAME:', pathname);

	console.log('PATHNAME:', pathname.split('/'));
	const [ blank, type, id ] = pathname.split('/');
	console.log('blank:', blank);
	console.log('type:', type);
	console.log('id:', id);

	const username = useSelector((st) => st.currUser.username);
	const isUser = username === id;

	return <Route {...rest} render={(props) => (isUser ? <Component {...props} /> : <Redirect to="/signin" />)} />;
};

export default PrivateUserRoute;
