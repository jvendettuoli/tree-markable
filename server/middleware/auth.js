/** Convenience middleware to handle common auth cases in routes. */

const { verifyToken } = require('../firebase/firebaseAuth');
const ExpressError = require('../helpers/expressError');

/** Middleware to use when they must provide a valid token.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If not, raises Unauthorized.
 *
 */

async function authRequired(req, res, next) {
	try {
		const tokenStr = req.body._token || req.query._token;
		let token = await verifyToken(tokenStr);
		req.uid = token.uid;

		return next();
	} catch (err) {
		const unauthorized = new ExpressError(err.message, err.code);
		return next(unauthorized);
	}
}

/** Middleware to use when they must provide a valid token that is an admin token.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If not, raises Unauthorized.
 *
 */

async function adminRequired(req, res, next) {
	try {
		const tokenStr = req.body._token;

		let token = await verifyToken(tokenStr);
		req.uid = token.uid;

		if (token.is_admin) {
			return next();
		}

		// throw an error, so we catch it in our catch, below
		throw new Error();
	} catch (err) {
		const unauthorized = new Error('You must be an admin to access.');
		unauthorized.status = 401;

		return next(unauthorized);
	}
}

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If not, raises Unauthorized.
 *
 */

function ensureCorrectUser(req, res, next) {
	try {
		const tokenStr = req.body._token || req.query._token;

		let token = jwt.verify(tokenStr, SECRET);
		req.username = token.username;

		if (token.username === req.params.username) {
			return next();
		}

		// throw an error, so we catch it in our catch, below
		throw new Error();
	} catch (e) {
		const unauthorized = new Error('You are not authorized.');
		unauthorized.status = 401;

		return next(unauthorized);
	}
}

module.exports = {
	authRequired,
	adminRequired,
	ensureCorrectUser
};
