/** Express app for tree-markable. */
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

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
