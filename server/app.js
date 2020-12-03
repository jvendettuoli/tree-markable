/** Express app for tree-markable. */
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json());

// add basic logging system
app.use(morgan('tiny'));

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
