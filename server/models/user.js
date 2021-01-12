const db = require('../db');
const ExpressError = require('../helpers/expressError');
const partialUpdate = require('../helpers/partialUpdate');
const formatCoordinates = require('../helpers/formatCoordinates');

/** Related functions for users. */

class User {
	/** Register user with data. Returns new user data. */

	static async register(data) {
		console.log('Models - User.register - Start');

		// Convert coordinates into Point format for Postgresql: 'x,y'
		const home_geolocation = formatCoordinates(data.home_geolocation);

		try {
			const result = await db.query(
				`INSERT INTO users 
              (firebase_id, username, email, img_url, home_geolocation, is_admin) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING firebase_id, username, email, img_url, home_geolocation, is_admin, created_at`,
				[
					data.firebase_id,
					data.username,
					data.email,
					data.img_url,
					home_geolocation,
					data.is_admin
				]
			);

			return result.rows[0];
		} catch (err) {
			if (err.code === '23505') {
				if (err.constraint === 'users_pkey') {
					throw new ExpressError(
						`Duplicate firebase_id found for: '${data.firebase_id}'.`,
						400
					);
				}
				if (err.constraint === 'users_email_key') {
					throw new ExpressError(
						`Duplicate email found for: '${data.email}'.`,
						400
					);
				}
				if (err.constraint === 'users_username_key') {
					throw new ExpressError(
						`Duplicate username found for: '${data.username}'.`,
						400
					);
				}
			}
			else {
				throw new ExpressError(err.message, 400);
			}
		}
	}

	/** Find all users. */

	static async findAll() {
		const result = await db.query(
			`SELECT firebase_id, username, email, img_url, home_geolocation, is_admin, created_at
          FROM users
          ORDER BY username`
		);

		return result.rows;
	}

	/** Given a username, return data about user. */

	static async findByUsername(username) {
		const userRes = await db.query(
			`SELECT firebase_id, username, email, img_url, home_geolocation, is_admin, created_at
            FROM users 
            WHERE username = $1`,
			[ username ]
		);

		const user = userRes.rows[0];

		if (!user) {
			const error = new ExpressError(
				`There exists no user '${username}'`,
				404
			);
			throw error;
		}

		return user;
	}
	/** Given a firebase_id, return data about user. */

	static async findByUid(uid) {
		const userRes = await db.query(
			`SELECT firebase_id, username, email, img_url, home_geolocation, is_admin, created_at
            FROM users 
            WHERE firebase_id = $1`,
			[ uid ]
		);

		const user = userRes.rows[0];

		if (!user) {
			const error = new ExpressError(
				`There exists no firebase_id '${uid}'`,
				404
			);
			throw error;
		}

		return user;
	}

	/** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Return data for changed user.
   *
   */

	static async update(username, data) {
		if (data.hasOwnProperty('home_geolocation')) {
			data.home_geolocation = formatCoordinates(
				data.home_geolocation
			);
		}

		let { query, values } = partialUpdate(
			'users',
			data,
			'username',
			username
		);

		const result = await db.query(query, values);
		const user = result.rows[0];

		if (!user) {
			let notFound = new ExpressError(
				`There exists no user: '${username}'`,
				404
			);
			throw notFound;
		}

		return result.rows[0];
	}

	/** Delete given user from database; returns undefined. */

	static async remove(username) {
		let result = await db.query(
			`DELETE FROM users 
                WHERE username = $1
                RETURNING username`,
			[ username ]
		);

		if (result.rows.length === 0) {
			let notFound = new ExpressError(
				`There exists no user '${username}'`,
				404
			);
			throw notFound;
		}
	}

	/**
	 * User to Tree relationships
	 */

	/**Create a user to tree relationship, given user id and tree id. */
	static async addTree(uid, treeId) {
		await db.query(
			`INSERT INTO users_trees (user_id, tree_id) VALUES ($1, $2)`,
			[ uid, treeId ]
		);
	}
	static async getTrees(uid) {
		const result = await db.query(
			`SELECT FROM users_trees WHERE user_id = $1`,
			[ uid ]
		);
		return result;
	}
}
module.exports = User;
