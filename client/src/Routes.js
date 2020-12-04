import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import Signup from './Signup';

function Routes() {
	return (
		<div className="Routes">
			<Switch>
				<Route exact path="/">
					<Home />
				</Route>
				<Route exact path="/signup">
					<Signup />
				</Route>
			</Switch>
		</div>
	);
}

export default Routes;
