import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistedStore } from './store';

import App from './App';

// Baseline Styles for Material-UI
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { lightGreen, brown } from '@material-ui/core/colors';

const theme = createMuiTheme({
	palette : {
		primary   : {
			main     : lightGreen[900],
			accent   : lightGreen.A400,
			lightest : lightGreen[50]
		},
		secondary : {
			main     : brown[500],
			lightest : brown[50]
		}
	}
});

ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistedStore}>
			<ThemeProvider theme={theme}>
				<CssBaseline>
					<App />
				</CssBaseline>
			</ThemeProvider>
		</PersistGate>
	</Provider>,
	document.getElementById('root')
);
