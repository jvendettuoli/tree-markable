const ExpressError = require('../helpers/expressError');

const handleFirebaseErrors = (err, next) => {
	if (err.code === 'auth/id-token-expired') {
		return next(
			new ExpressError(
				'Firebase ID token has expired. Get a fresh ID token from your client app and try again.',
				401
			)
		);
	}
	else if (err.code === 'auth/argument-error') {
		return next(
			new ExpressError(
				'Firebase ID token has invalid signature.',
				401
			)
		);
	}
};

module.exports = handleFirebaseErrors;
