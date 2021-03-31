/** Routes for users. */

const express = require('express');
const router = express.Router();

const Comment = require('../models/comment');

const ExpressError = require('../helpers/expressError');
const {
	authRequired,
	ensureCorrectUser,
	ensureIsCreator,
	ensureIsGroupModOrCommentCreator
} = require('../middleware/auth');

const TREES = 'trees';
const GROUPS = 'groups';

/** GET / => {comments: [comment, ...]} */

router.get('/', authRequired, async function(req, res, next) {
	try {
		delete req.query._token;
		const comments = await Comment.findAll(req.query);
		return res.json({ comments });
	} catch (err) {
		return next(err);
	}
});
/** GET /[type]/[id] => {comments: [comment, ...]}
 *  Gets comments for a specific tree or group
 */

router.get('/:type/:id', async function(req, res, next) {
	try {
		delete req.query._token;
		console.log('GET comments/:type/:id - params.type', req.params.type);
		let comments;
		if (req.params.type === TREES) comments = await Comment.getCommentsOnTree(req.params.id);
		if (req.params.type === GROUPS) comments = await Comment.getCommentsOnGroup(req.params.id);
		return res.json({ comments });
	} catch (err) {
		return next(err);
	}
});

/** GET /[id] => {comment: comment} */

router.get('/:id', async function(req, res, next) {
	try {
		const comment = await Comment.findOne(req.params.id);
		return res.json({ comment });
	} catch (err) {
		return next(err);
	}
});

/** POST / {commentData}  => {newComment: comment} */

router.post('/', authRequired, async function(req, res, next) {
	try {
		delete req.body._token;

		// Apply user's Firebase UID as the author ID
		req.body.author_id = req.token.uid;
		req.body.author_name = req.token.name;

		const newComment = await Comment.create(req.body);
		return res.status(201).json({ newComment });
	} catch (err) {
		return next(err);
	}
});

/** PATCH /[id] {commentData} => {comment: comment} */

router.patch('/:id', ensureIsCreator, async function(req, res, next) {
	try {
		delete req.body._token;

		const updatedComment = await Comment.update(req.params.id, req.body);
		return res.json({ updatedComment });
	} catch (err) {
		return next(err);
	}
});

/** DELETE /[id]  =>  {message: "Comment with ID :id deleted"}  */

router.delete('/:id', ensureIsGroupModOrCommentCreator, async function(req, res, next) {
	try {
		await Comment.remove(req.params.id);
		return res.json({
			message : `Comment with ID '${req.params.id}' deleted`
		});
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
