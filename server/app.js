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

/**
 * If starting in production mode, set express to serve the 
 * index.html file from create-react-app by default so that it can
 * function as a single page application.
 */
if (process.env.NODE_ENV === 'production') {
	console.log('__dirname', __dirname);
	console.log("path.join(__dirname, '../client/build'", path.resolve(__dirname, '../client/build'));
	console.log(
		"path.resolve(__dirname, '..', 'client', 'build', 'index.html')",
		path.resolve(__dirname, '..', 'client', 'build', 'index.html')
	);
	app.use(express.static(path.join(__dirname, '../client/build')));

	// Handle react routing for single page application for any path.
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
	});
}

//Routes
app.use('/users', usersRoutes);
app.use('/groups', groupsRoutes);
app.use('/trees', treesRoutes);
app.use('/comments', commentsRoutes);

/** 404 handler */
app.use(function(req, res, next) {
	const err = new ExpressError('Not Found', 404);

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
