/** Routes for users. */

const express = require('express');
const router = express.Router();
const { validate } = require('jsonschema');

const User = require('../models/user');
const {
	updateUserInFirebase,
	deleteFirebaseUser
} = require('../firebase/firebaseAuth');
const ExpressError = require('../helpers/expressError');
const { authRequired, ensureCorrectUser } = require('../middleware/auth');
const { userNewSchema, userUpdateSchema } = require('../schemas');

/** GET / => {users: [user, ...]} */

router.get('/', authRequired, async function(req, res, next) {
	try {
		const users = await User.findAll();
		return res.json({ users });
	} catch (err) {
		return next(err);
	}
});

/** GET /[username] => {user: user} */

router.get('/:username', async function(req, res, next) {
	try {
		const user = await User.findByUsername(req.params.username);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

/** POST / {userdata}  => {newUser: user} */

router.post('/', authRequired, async function(req, res, next) {
	try {
		delete req.body._token;
		const validation = validate(req.body, userNewSchema);

		if (!validation.valid) {
			return next(
				new ExpressError(
					validation.errors.map((err) => err.stack),
					400
				)
			);
		}

		const newUser = await User.register(req.body);

		return res.status(201).json({ newUser });
	} catch (err) {
		//Firebase User can sometimes be created but then user creation
		//in database fails (such as existing username with different email)
		//deletes user in Firebase if creation fails
		await deleteFirebaseUser(req.body.firebase_id);
		return next(err);
	}
});

/** PATCH /[username] {userData} => {user: updatedUser} */

router.patch('/:username', ensureCorrectUser, async function(
	req,
	res,
	next
) {
	console.log('Users - Patch - req.body', req.body);
	try {
		delete req.body._token;
		if ('firebase_id' in req.body || 'is_admin' in req.body) {
			return next({
				status  : 400,
				message : 'Invalid keys in update request.'
			});
		}

		const validation = validate(req.body, userUpdateSchema);
		if (!validation.valid) {
			return next({
				status  : 400,
				message : validation.errors.map((e) => e.stack)
			});
		}

		//Update database
		const user = await User.update(req.params.username, req.body);

		// Update Firebase Auth
		const firebaseProperties = [
			'email',
			'phoneNumber',
			'username',
			'img_url',
			'password'
		];
		if (
			Object.keys(req.body).some((property) => {
				return firebaseProperties.includes(property);
			})
		) {
			const result = await updateUserInFirebase(req.token.uid, {
				...req.body
			});
			console.log(
				'Users Routes - Patch - Post Firebase update - result',
				result
			);
			if (result instanceof Error) {
				console.log(
					'Users Routes - Patch - Post Firebase update - error'
				);

				throw result;
			}
		}

		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

/** DELETE /[username]  =>  {message: "User deleted"}  */

router.delete('/:username', ensureCorrectUser, async function(
	req,
	res,
	next
) {
	try {
		await deleteFirebaseUser(req.token.uid);
		await User.remove(req.params.username);
		return res.json({
			message : `User '${req.params.username}' deleted`
		});
	} catch (err) {
		return next(err);
	}
});

/**
 * User to Tree routes
 */

/** GET user's saved trees /[username]/trees => {savedTrees}*/

router.get('/:username/trees', ensureCorrectUser, async function(
	req,
	res,
	next
) {
	try {
		const savedTrees = await User.getTrees(req.token.uid);
		return res.json(savedTrees);
	} catch (err) {
		return next(err);
	}
});

/** ADD TREE TO USER /[username]/trees/[id] => 
 * {message: 'Tree [id] added to User [username]'}*/

router.post('/:username/trees/:id', authRequired, async function(
	req,
	res,
	next
) {
	try {
		await User.addTree(req.token.uid, req.params.id);
		return res.json({
			message : `Tree '${req.params.id}' added to User '${req.params
				.username}'`
		});
	} catch (err) {
		return next(err);
	}
});

/** REMOVE TREE FROM USER /[username]/trees/[id] => 
 * {message: 'Tree [id] removed from User [username]'}*/

router.delete('/:username/trees/:id', authRequired, async function(
	req,
	res,
	next
) {
	try {
		await User.removeTree(req.token.uid, req.params.id);
		return res.json({
			message : `Tree '${req.params.id}' removed from User '${req
				.params.username}'`
		});
	} catch (err) {
		return next(err);
	}
});

/**
 * User to Group routes
 */

/** GET user's saved groups /[username]/groups => {savedGroups}*/

router.get('/:username/groups', ensureCorrectUser, async function(
	req,
	res,
	next
) {
	try {
		const savedGroups = await User.getGroups(req.token.uid);
		return res.json(savedGroups);
	} catch (err) {
		return next(err);
	}
});

/** ADD GROUP TO USER /[username]/groups/[id] => 
 * {message: 'Group [id] added to User [username]'}*/

router.post('/:username/groups/:id', authRequired, async function(
	req,
	res,
	next
) {
	try {
		await User.addGroup(req.token.uid, req.params.id);
		return res.json({
			message : `Group '${req.params.id}' added to User '${req.params
				.username}'`
		});
	} catch (err) {
		return next(err);
	}
});

/** REMOVE GROUP FROM USER /[username]/groups/[id] => 
 * {message: 'Group [id] removed from User [username]'}*/

router.delete('/:username/groups/:id', authRequired, async function(
	req,
	res,
	next
) {
	try {
		await User.removeGroup(req.token.uid, req.params.id);
		return res.json({
			message : `Group '${req.params.id}' removed from User '${req
				.params.username}'`
		});
	} catch (err) {
		return next(err);
	}
});
module.exports = router;
