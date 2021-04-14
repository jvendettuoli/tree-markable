/** Convenience middleware to handle common auth cases in routes. */

const { verifyToken } = require('../firebase/firebaseAuth');
const ExpressError = require('../helpers/expressError');
const handleFirebaseErrors = require('../firebase/firebaseErrors');
const Group = require('../models/group');
const Tree = require('../models/tree');
const Comment = require('../models/comment');

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
			throw new ExpressError(`Must have admin privileges to access this endpoint.`, 401);
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
		console.log('Middleware - ensureCorrectUser - token result', result);
		if (result instanceof Error) {
			throw result;
		}

		if (result.name !== req.params.username) {
			throw new ExpressError(`Must be user '${req.params.username}' or admin to access this endpoint.`, 401);
		}
		req.token = result;
		return next();
	} catch (err) {
		handleFirebaseErrors(err, next);
		return next(err);
	}
}

/** Middleware to use when user must provide a valid token & be creator
 * of item being affected.
 * Firebase token's uid compared to item's creator.
 * 
 * If valid, add token onto req and proceed to next.
 *
 * If not, raises error.
 *
 */

async function ensureIsCreator(req, res, next) {
	console.log('Middleware - ensureCorrectUser - Start');
	try {
		const tokenStr = req.body._token || req.query._token;

		let result = await verifyToken(tokenStr);

		if (result instanceof Error) {
			throw result;
		}

		let item;
		let itemCreatorUid;
		if (req.baseUrl === '/groups') {
			item = await Group.findOne(req.params.id);
			itemCreatorUid = item.creator;
		}
		else if (req.baseUrl === '/trees') {
			item = await Tree.findOne(req.params.id);
			itemCreatorUid = item.creator;
		}
		else if (req.baseUrl === '/comments') {
			item = await Comment.findOne(req.params.id);
			itemCreatorUid = item.author_id;
		}

		if (itemCreatorUid !== result.uid) {
			throw new ExpressError(`Must be creator of '${item.name}' or admin to access this endpoint.`, 401);
		}
		req.token = result;
		return next();
	} catch (err) {
		handleFirebaseErrors(err, next);
		return next(err);
	}
}

/** Middleware to use when user must provide a valid token & be a
 * moderator of the group.
 * Firebase token's uid compared list of provided group's mods.
 * 
 * If token is valid add and user is mod of group, proceed to next.
 *
 * If not, raises error.
 *
 */

async function ensureIsGroupMod(req, res, next) {
	console.log('Middleware - ensureIsGroupMod - Start');
	try {
		const tokenStr = req.body._token || req.query._token;

		let result = await verifyToken(tokenStr);

		if (result instanceof Error) {
			throw result;
		}

		const groupMods = await Group.getModerators(req.params.groupId);
		console.log('Middleware - ensureIsGroupMod - groupMods', groupMods);

		if (!groupMods.includes(result.uid)) {
			throw new ExpressError(
				`Must be moderator or owner of Group '${req.params.groupId}' to access this endpoint.`,
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

/** Middleware to use when user must provide a valid token & be a
 * moderator of the group or creator of comment being affected.
 * Firebase token's uid compared list of provided group's mods.
 * Firebase token's uid compared to comment's creator.
 * 
 * If token is valid and user is mod of group or item's creator,
 *  proceed to next.
 *
 * If not, raises error.
 *
 */

async function ensureIsModOrCommentCreator(req, res, next) {
	console.log('Middleware - ensureIsModorCommentCreator - Start');
	try {
		const tokenStr = req.body._token || req.query._token;

		let result = await verifyToken(tokenStr);

		if (result instanceof Error) {
			throw result;
		}

		const comment = await Comment.findOne(req.params.id);
		console.log('Middleware - ensureIsModorCommentCreator -comment.author_id', comment.author_id, result.uid);
		const isItemAuthor = comment.author_id === result.uid;
		let itemId = null;
		let itemMods = null;
		if (req.body.type === 'groups') {
			itemId = await Group.getGroupIdByCommentId(req.params.id);
			itemMods = await Group.getModerators(itemId);
		}
		else if (req.body.type === 'trees') {
			itemId = await Tree.getTreeIdByCommentId(req.params.id);
			const tree = await Tree.findOne(itemId);
			itemMods = [ tree.creator ];
		}

		console.log('Middleware - ensureIsModorCommentCreator -group', itemId, itemMods);
		if (!itemMods.includes(result.uid) && !isItemAuthor) {
			throw new ExpressError(
				`Must be moderator of group ${itemId} or author of comment '${req.params.id}' to access this endpoint.`,
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

module.exports = {
	authRequired,
	adminRequired,
	ensureCorrectUser,
	ensureIsCreator,
	ensureIsGroupMod,
	ensureIsModOrCommentCreator
};
