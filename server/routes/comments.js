/** Routes for users. */

const express = require('express');
const router = express.Router();

const Comment = require('../models/comment');

const ExpressError = require('../helpers/expressError');
const {
	authRequired,
	ensureCorrectUser,
	ensureIsCreator
} = require('../middleware/auth');

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

/** GET /[id] => {comment: comment} */

router.get('/:id', authRequired, async function(req, res, next) {
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
		req.body.author = req.token.uid;

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

		const user = await Comment.update(req.params.id, req.body);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

/** DELETE /[id]  =>  {message: "Comment with ID :id deleted"}  */

router.delete('/:id', ensureIsCreator, async function(req, res, next) {
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
