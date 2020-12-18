const db = require('../db');
const ExpressError = require('../helpers/expressError');
const partialUpdate = require('../helpers/partialUpdate');

/** Related functions for groups. */

class Group {
	/** Create group with data. Returns new group data. */

	static async create(data) {
		console.log('Models - Group.create - Start');

		try {
			const result = await db.query(
				`INSERT INTO groups 
              (name, description, is_public, creator) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, name, description, is_public, creator, created_at`,
				[
					data.name,
					data.description,
					data.is_public,
					data.creator
				]
			);

			return result.rows[0];
		} catch (err) {
			if (err.code === '23505') {
				if (err.constraint === 'groups_name_key') {
					throw new ExpressError(
						`Duplicate group name found for: '${data.name}'.`,
						400
					);
				}
			}
			else {
				throw new ExpressError(err.message, 400);
			}
		}
	}

	/** Find all groups. */

	static async findAll() {
		const result = await db.query(
			`SELECT id, name, description, is_public, creator, created_at
          FROM groups
          ORDER BY name`
		);

		return result.rows;
	}

	/** Given a group id, return data about group. */

	static async findOne(id) {
		const groupRes = await db.query(
			`SELECT id, name, description, is_public, creator, created_at
            FROM groups 
            WHERE id = $1`,
			[ id ]
		);

		const group = groupRes.rows[0];

		if (!group) {
			const error = new ExpressError(
				`There exists no group with id '${id}'.`,
				404
			);
			throw error;
		}

		return group;
	}

	/** Update group data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Return data for changed group.
   *
   */

	static async update(id, data) {
		let { query, values } = partialUpdate('groups', data, 'id', id);

		const result = await db.query(query, values);
		const group = result.rows[0];

		if (!group) {
			let notFound = new ExpressError(
				`There exists no group with id: '${id}'`,
				404
			);
			throw notFound;
		}

		return result.rows[0];
	}

	/** Delete given group from database; returns undefined. */

	static async remove(id) {
		let result = await db.query(
			`DELETE FROM groups 
                WHERE id = $1
                RETURNING id`,
			[ id ]
		);

		if (result.rows.length === 0) {
			let notFound = new ExpressError(
				`There exists no group with id: '${id}'`,
				404
			);
			throw notFound;
		}
	}
}

module.exports = Group;
