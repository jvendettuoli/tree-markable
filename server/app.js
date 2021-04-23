/** Express app for tree-markable. */
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const ExpressError = require('./helpers/expressError');
const usersRoutes = require('./routes/users');
const groupsRoutes = require('./routes/groups');
const treesRoutes = require('./routes/trees');
const commentsRoutes = require('./routes/comments');

const app = express();

app.use(express.json());
app.use(cors());

// add basic logging system
app.use(morgan('tiny'));

//Routes
app.use('/api/users', usersRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/trees', treesRoutes);
app.use('/api/comments', commentsRoutes);

/**
 * If starting in production mode, set express to serve the 
 * index.html file from create-react-app by default so that it can
 * function as a single page application.
 */
if (process.env.NODE_ENV === 'production') {
	console.log('Serving static file: ', path.join(__dirname, '../client/build'));
	app.use(express.static(path.join(__dirname, '../client/build')));

	// Handle react routing for single page application for any path.
	console.log('app.js - sendFile: ', path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
	app.get([ '/', '/*' ], (req, res) => {
		console.log('app.js - sendFile for req.hostname: ', req.hostname, ', originalUrl: ', req.originalUrl);
		res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
	});
}

/** 404 handler */
app.use(function(req, res, next) {
	const err = new ExpressError(`${req.path} Not Found`, 404);

	// pass the error to the next piece of middleware
	return next(err);
});

/** general error handler */
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	console.error(err.stack);

	return res.json({
		status  : err.status,
		message : err.message
	});
});

module.exports = app;
