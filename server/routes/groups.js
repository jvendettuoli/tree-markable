/** Routes for users. */

const express = require('express');
const router = express.Router();
const { validate } = require('jsonschema');

const Group = require('../models/group');

const ExpressError = require('../helpers/expressError');
const {
	authRequired,
	ensureCorrectUser,
	ensureIsCreator
} = require('../middleware/auth');
const { groupNewSchema, groupUpdateSchema } = require('../schemas');

/** GET / => {users: [user, ...]} */

router.get('/', authRequired, async function(req, res, next) {
	try {
		const groups = await Group.findAll();
		return res.json({ groups });
	} catch (err) {
		return next(err);
	}
});

/** GET /[id] => {group: group} */

router.get('/:id', authRequired, async function(req, res, next) {
	try {
		const group = await Group.findOne(req.params.id);
		return res.json({ group });
	} catch (err) {
		return next(err);
	}
});

/** POST / {groupData}  => {newGroup: group} */

router.post('/', authRequired, async function(req, res, next) {
	try {
		delete req.body._token;
		const validation = validate(req.body, groupNewSchema);

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

		const newGroup = await Group.create(req.body);
		return res.status(201).json({ newGroup });
	} catch (err) {
		return next(err);
	}
});

/** PATCH /[id] {groupData} => {group: group} */

router.patch('/:id', ensureIsCreator, async function(req, res, next) {
	try {
		delete req.body._token;

		const validation = validate(req.body, groupUpdateSchema);
		if (!validation.valid) {
			return next({
				status  : 400,
				message : validation.errors.map((e) => e.stack)
			});
		}

		const user = await Group.update(req.params.id, req.body);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

/** DELETE /[id]  =>  {message: "Group with ID :id deleted"}  */

router.delete('/:id', ensureIsCreator, async function(req, res, next) {
	try {
		await Group.remove(req.params.id);
		return res.json({
			message : `Group with ID '${req.params.id}' deleted`
		});
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
