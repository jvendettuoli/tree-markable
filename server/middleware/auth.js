/** Convenience middleware to handle common auth cases in routes. */

const { verifyToken } = require('../firebase/firebaseAuth');
const ExpressError = require('../helpers/expressError');
const handleFirebaseErrors = require('../firebase/firebaseErrors');

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
		console.log(result);
		if (result instanceof Error) {
			throw result;
		}

		req.token = result;

		return next();
	} catch (err) {
		handleFirebaseErrors(err, next);
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

		let result = await verifyToken(tokenStr);
		if (result instanceof Error) {
			throw result;
		}

		if (!token.claims.is_admin) {
			throw new ExpressError(
				`Must have admin privileges to access this endpoint.`,
				401
			);
		}
		req.token = result;
		return next();
	} catch (err) {
		handleFirebaseErrors(err, next);
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
		handleFirebaseErrors(err, next);
		`   `;
		return next(err);
	}
}

module.exports = {
	authRequired,
	adminRequired,
	ensureCorrectUser
};
