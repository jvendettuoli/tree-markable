import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { verifyAuth } from './actions/auth';
import Navigation from './Navigation';
import Routes from './Routes';

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
				<Navigation>
					<Routes />
				</Navigation>
			</div>
		</BrowserRouter>
	);
}

export default App;
