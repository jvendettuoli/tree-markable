const db = require('../db');
const bcrypt = require('bcrypt');
const ExpressError = require('../helpers/expressError');
const partialUpdate = require('../helpers/partialUpdate');
const admin = require('../firebase/firebaseServerAdmin');

const { BCRYPT_WORK_FACTOR } = require('../config');

/** Related functions for users. */

class User {
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

	static async findOne(username) {
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

	/** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Return data for changed user.
   *
   */

	static async update(username, data) {
		if (data.password) {
			data.password = await bcrypt.hash(
				data.password,
				BCRYPT_WORK_FACTOR
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
				`There exists no user '${username}`,
				404
			);
			throw notFound;
		}

		delete user.password;
		delete user.is_admin;

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
}

module.exports = User;
