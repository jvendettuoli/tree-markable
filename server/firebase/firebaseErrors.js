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
		return next(new ExpressError('Firebase ID token has invalid signature.', 401));
	}
	else if (err.code === 'auth/email-already-exists') {
		return next(new ExpressError('The email is already in use by another Firebase account', 400));
	}
};

module.exports = handleFirebaseErrors;
