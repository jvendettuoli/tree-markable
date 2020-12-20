/** Routes for users. */

const express = require('express');
const router = express.Router();
const { validate } = require('jsonschema');

const Tree = require('../models/tree');

const ExpressError = require('../helpers/expressError');
const {
	authRequired,
	ensureCorrectUser,
	ensureIsCreator
} = require('../middleware/auth');
const { treeNewSchema, treeUpdateSchema } = require('../schemas');

/** GET / => {trees: [tree, ...]} */

router.get('/', authRequired, async function(req, res, next) {
	try {
		const trees = await Tree.findAll();
		return res.json({ trees });
	} catch (err) {
		return next(err);
	}
});

/** GET /[id] => {tree: tree} */

router.get('/:id', authRequired, async function(req, res, next) {
	try {
		const tree = await Tree.findOne(req.params.id);
		return res.json({ tree });
	} catch (err) {
		return next(err);
	}
});

/** POST / {treeData}  => {newTree: tree} */

router.post('/', authRequired, async function(req, res, next) {
	try {
		delete req.body._token;
		const validation = validate(req.body, treeNewSchema);

		// Apply user's Firebase UID as the creator ID
		req.body.creator = req.token.uid;

		if (!validation.valid) {
			return next(
				new ExpressError(
					validation.errors.map((err) => err.stack),
					400
				)
			);
		}

		const newTree = await Tree.create(req.body);
		return res.status(201).json({ newTree });
	} catch (err) {
		return next(err);
	}
});

/** PATCH /[id] {treeData} => {tree: tree} */

router.patch('/:id', ensureIsCreator, async function(req, res, next) {
	try {
		delete req.body._token;

		const validation = validate(req.body, treeUpdateSchema);
		if (!validation.valid) {
			return next({
				status  : 400,
				message : validation.errors.map((e) => e.stack)
			});
		}

		const user = await Tree.update(req.params.id, req.body);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

/** DELETE /[id]  =>  {message: "Tree with ID :id deleted"}  */

router.delete('/:id', ensureIsCreator, async function(req, res, next) {
	try {
		await Tree.remove(req.params.id);
		return res.json({
			message : `Tree with ID '${req.params.id}' deleted`
		});
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
