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
		return next(err);
	}
});

/** PATCH /[username] {userData} => {user: updatedUser} */

router.patch('/:username', ensureCorrectUser, async function(
	req,
	res,
	next
) {
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

		// Update Firebase Auth
		const firebaseProperties = [
			'email',
			'phoneNumber',
			'username',
			'img_url'
		];
		if (
			Object.keys(req.body).some((property) => {
				return firebaseProperties.includes(property);
			})
		) {
			const result = await updateUserInFirebase(
				req.token.uid,
				req.body
			);
			if (result instanceof Error) {
				throw result;
			}
		}

		//Update database
		const user = await User.update(req.params.username, req.body);
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

/** ADD TREE TO USER /[username]/trees/[id] => {savedTrees}*/

router.post('/:username/trees/:id', ensureCorrectUser, async function(
	req,
	res,
	next
) {
	try {
		console.log(req.token);
		await User.addTree(req.token.uid, req.params.id);
		return res.json({
			message : `Tree '${req.params.username}' added to User '${req
				.params.username}'`
		});
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
