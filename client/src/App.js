import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './Routes';
import NavBar from './NavBar';

function App() {
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
