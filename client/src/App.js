import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { verifyAuth } from './actions/auth';
import { useTheme } from '@material-ui/core/styles';

import Routes from './Routes';
import NavBar from './NavBar';
import NavDrawer from './NavDrawer';

import useStyles from './styles/navDrawer';

function App() {
	const theme = useTheme();
	const classes = useStyles(theme);
	const dispatch = useDispatch();
	// Set Firebase Auth Listener, onAuthStateChanged, on App
	// initialization. unsubscribe removes listener on dismount.

	useEffect(
		() => {
			const unsubscribe = dispatch(verifyAuth());
			return () => unsubscribe();
		},
		[ dispatch ]
	);

	return (
		<BrowserRouter>
			<div className="App">
				<NavDrawer>
					<Routes />
				</NavDrawer>
			</div>
		</BrowserRouter>
	);
}

export default App;
