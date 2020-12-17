/** Convenience middleware to handle common auth cases in routes. */

const { verifyToken } = require('../firebase/firebaseAuth');
const ExpressError = require('../helpers/expressError');
const User = require('../models/user');

/** Middleware to use when they must provide a valid Firebase token.
 *
 * If valid adds token on to req and proceeds to next.
 *
 * If not, raises error.
 *
 */

async function authRequired(req, res, next) {
	console.log('Middleware - authRequired - Start');
	try {
		const tokenStr = req.body._token || req.query._token;
		let result = await verifyToken(tokenStr);
		if (result instanceof Error) {
			throw result;
		}

		req.token = result;

		return next();
	} catch (err) {
		if (err.code === 'auth/id-token-expired') {
			return next(
				new ExpressError(
					'Firebase ID token has expired. Get a fresh ID token from your client app and try again.',
					401
				)
			);
		}
		return next(err);
	}
}

/** Middleware to use when they must provide a valid Firebase token that has a
 * custom admin claim.
 *
 * If valid adds token on to req and proceeds to next.
 *
 * If not, raises error.
 *
 */

async function adminRequired(req, res, next) {
	try {
		const tokenStr = req.body._token;

		let token = await verifyToken(tokenStr);
		console.log('TOken', token);

		if (!token.claims.is_admin) {
			throw new ExpressError(
				`Must have admin privileges to access this endpoint.`,
				401
			);
		}
		req.token = token;
		return next();
	} catch (err) {
		if (err.code === 'auth/id-token-expired') {
			return next(
				new ExpressError(
					'Firebase ID token has expired. Get a fresh ID token from your client app and try again.',
					401
				)
			);
		}
		return next(err);
	}
}

/** Middleware to use when user must provide a valid token & be user matching
 * Username provided as route param compared to Firebase token's
 * name property.
 * 
 * If valid, add token onto req and proceed to next.
 *
 * If not, raises error.
 *
 */

async function ensureCorrectUser(req, res, next) {
	console.log('Middleware - ensureCorrectUser - Start');
	try {
		const tokenStr = req.body._token || req.query._token;

		let result = await verifyToken(tokenStr);
		if (result instanceof Error) {
			throw result;
		}

		if (result.name !== req.params.username) {
			throw new ExpressError(
				`Must be user '${req.params
					.username}' or admin to access this endpoint.`,
				401
			);
		}
		req.token = result;
		return next();
	} catch (err) {
		if (err.code === 'auth/id-token-expired') {
			return next(
				new ExpressError(
					'Firebase ID token has expired. Get a fresh ID token from your client app and try again.',
					401
				)
			);
		}
		return next(err);
	}
}

module.exports = {
	authRequired,
	adminRequired,
	ensureCorrectUser
};
