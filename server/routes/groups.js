/** Routes for users. */

const express = require('express');
const router = express.Router();
const { validate } = require('jsonschema');

const Group = require('../models/group');
const User = require('../models/user');

const ExpressError = require('../helpers/expressError');
const {
	authRequired,
	ensureCorrectUser,
	ensureIsCreator,
	ensureIsGroupMod
} = require('../middleware/auth');
const { groupNewSchema, groupUpdateSchema } = require('../schemas');

/** GET / => {groups: [group, ...]} */

router.get('/', async function(req, res, next) {
	try {
		delete req.query._token;
		const groups = await Group.findAll(req.query);
		return res.json({ groups });
	} catch (err) {
		return next(err);
	}
});

/** GET /[id] => {group: group} */

router.get('/:id', async function(req, res, next) {
	try {
		const group = await Group.findOne(req.params.id);
		//TODO REMOVE
		// const groupMembers = await Group.getModerators(req.params.id);
		// console.log('Group Members', groupMembers);
		return res.json({ group });
	} catch (err) {
		return next(err);
	}
});

/** GET /[id]/members => {group: group} 
 * Get group members.
*/

router.get('/:id/members', async function(req, res, next) {
	try {
		const groupMembers = await Group.getMembers(req.params.id);
		return res.json({ groupMembers });
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
		await User.addGroup(req.token.uid, newGroup.id, true);
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

/**
 * Group to Tree routes
 */

/** GET GROUP'S TREES /[groupId]/trees => {savedTrees}*/

router.get('/:groupId/trees', async function(req, res, next) {
	try {
		const savedTrees = await Group.getTrees(req.params.groupId);
		return res.json(savedTrees);
	} catch (err) {
		return next(err);
	}
});

/** ADD TREE TO GROUP /[groupId]/trees/[id] => 
 * {message: 'Tree [id] added to Group [groupId]'}*/

router.post('/:groupId/trees/:id', ensureIsGroupMod, async function(
	req,
	res,
	next
) {
	try {
		await Group.addTree(req.params.groupId, req.params.id);
		return res.json({
			message : `Tree '${req.params.id}' added to Group '${req.params
				.groupId}'`
		});
	} catch (err) {
		return next(err);
	}
});

/** REMOVE TREE FROM GROUP /[groupId]/trees/[id] => 
 * {message: 'Tree [id] removed from Group [groupId]'}*/

router.delete('/:groupId/trees/:id', ensureIsGroupMod, async function(
	req,
	res,
	next
) {
	try {
		await Group.removeTree(req.params.groupId, req.params.id);
		return res.json({
			message : `Tree '${req.params.id}' removed from Group '${req
				.params.groupId}'`
		});
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
