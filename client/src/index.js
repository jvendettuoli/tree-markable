import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistedStore } from './store';

import App from './App';

// Baseline Styles for Material-UI
import CssBaseline from '@material-ui/core/CssBaseline';

ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistedStore}>
			<CssBaseline>
				<App />
			</CssBaseline>
		</PersistGate>
	</Provider>,
	document.getElementById('root')
);
