import React from 'react';
import { Route, Redirect, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

/** 
 * Wrapper Component for Route. Ensures that the user is autheticated
 * and is allowed to view the page before passing private component. 
 * If unauthenticated or the incorrect user, they are redirected 
 * to the login page, trees page, or groups page.
*/
const PrivateEntityRoute = ({ component: Component, ...rest }) => {
	const { location: { pathname } } = rest;
	const [ blank, type, id ] = pathname.split('/');
	const uid = useSelector((st) => st.currUser.uid);
	const itemCreator = useSelector((st) => st[type].entities[id].creator);
	const isCreator = uid === itemCreator;

	return (
		<Route {...rest} render={(props) => (isCreator ? <Component {...props} /> : <Redirect to={`/${type}`} />)} />
	);
};

export default PrivateEntityRoute;
