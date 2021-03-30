/** Routes for users. */

const express = require('express');
const router = express.Router();
const { validate } = require('jsonschema');

const Group = require('../models/group');
const User = require('../models/user');

const ExpressError = require('../helpers/expressError');
const { authRequired, ensureCorrectUser, ensureIsCreator, ensureIsGroupMod } = require('../middleware/auth');
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
			return next(new ExpressError(validation.errors.map((err) => err.stack), 400));
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

		const editGroup = await Group.update(req.params.id, req.body);
		return res.json({ editGroup });
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

/** GET GROUP'S TREES /[id]/trees => {savedTrees}*/

router.get('/:id/trees', async function(req, res, next) {
	try {
		const savedTrees = await Group.getTrees(req.params.id);
		return res.json(savedTrees);
	} catch (err) {
		return next(err);
	}
});

/** ADD TREE TO GROUP /[id]/trees/[treeId] => 
 * {message: 'Tree [treeId] added to Group [id]'}*/

router.post('/:id/trees/:treeId', ensureIsGroupMod, async function(req, res, next) {
	try {
		await Group.addTree(req.params.id, req.params.treeId);
		return res.json({
			message : `Tree '${req.params.treeId}' added to Group '${req.params.id}'`
		});
	} catch (err) {
		return next(err);
	}
});

/** REMOVE TREE FROM GROUP /[id]/trees/[treeId] => 
 * {message: 'Tree [treeId] removed from Group [id]'}*/

router.delete('/:id/trees/:treeId', ensureIsGroupMod, async function(req, res, next) {
	try {
		await Group.removeTree(req.params.id, req.params.treeId);
		return res.json({
			message : `Tree '${req.params.treeId}' removed from Group '${req.params.id}'`
		});
	} catch (err) {
		return next(err);
	}
});

/**
 * Group to Member Relationships
 */

/** ADD A MODERATER TO A GROUP /[id]/users/[id]=>
 * { message: `User [id] added as a mod to Group [id].` }
 */
router.patch('/:id/users/:userId/addmod', ensureIsCreator, async function(req, res, next) {
	console.log('Group Routes - AddMod', req.params);
	try {
		await Group.addMod(req.params.id, req.params.userId);
		return res.json({ message: `User ${userId} added as a mod to Group ${id}.` });
	} catch (err) {
		return next(err);
	}
});

/** ADD A MODERATER TO A GROUP /[id]/users/[id]=>
 * { message: `User [id] added as a mod to Group [id].` }
 */
router.patch('/:id/users/:userId/removemod', ensureIsCreator, async function(req, res, next) {
	console.log('Group Routes - removeMod', req.params);
	try {
		await Group.removeMod(req.params.id, req.params.userId);
		return res.json({ message: `User ${userId} removed as a mod from Group ${id}.` });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
