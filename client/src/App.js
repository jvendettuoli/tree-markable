import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { verifyAuth } from './actions/auth';

import Routes from './Routes';
import NavBar from './NavBar';

function App() {
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
				<NavBar />
				<Routes />
			</div>
		</BrowserRouter>
	);
}

export default App;
