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

	/** Find all groups based on queries supplied. With no passed queries
	 * will return all groups. */

	static async findAll(queries={}) {
		console.log('findAll - queries', queries);

		let queryIdx = 1;
		let whereStatements = [];
		let queryValues = [];
		let baseQuery = `SELECT id, name, description, is_public, creator, created_at, json_agg(g_t.tree_id) AS trees
		FROM groups
		LEFT JOIN groups_trees AS g_t ON id = g_t.group_id
		GROUP BY id
		`;

		// Helper function to clean up space. Pushes where statement and value, and incremends queryIdx by 1.
		const addQueryParam = (statement, value) => {
			whereStatements.push(statement);
			queryIdx += 1;
			queryValues.push(value);
		};

		// For each included query parameter, add appropriate language
		// to whereStatements and increment queryIdx by one.
		if (queries.search) {
			addQueryParam(
				`to_tsvector(name) @@ phraseto_tsquery($${queryIdx})`,
				queries.search
			);
		}

		let finalQuery = '';
		if (whereStatements.length > 0) {
			finalQuery = baseQuery.concat(
				' WHERE ',
				whereStatements.join(' AND ')
			);
		}

		const results = await db.query(
			finalQuery ? finalQuery : baseQuery,
			queryValues
		);

		for (const group of results.rows) {
			if (group.trees[0] === null) group.trees = [];
		}
		return results.rows;
	}

	/** Given a group id, return data about group. */

	static async findOne(id) {
		const groupRes = await db.query(
			`SELECT id, name, description, is_public, creator, created_at,trees, members
			FROM groups g
			LEFT JOIN LATERAL ( 
				SELECT json_agg(g_t.tree_id) AS trees
				FROM groups_trees g_t 
				WHERE g.id = g_t.group_id
				) g_t ON true
			INNER JOIN LATERAL (
				SELECT json_agg(json_build_object('user_id',u_g.user_id, 'is_moderator',u_g.is_moderator)) AS members
				FROM users_groups u_g 
				WHERE g.id = u_g.group_id
				) u_g on true
			WHERE g.id = $1`,
			[ id ]
		);

		const group = groupRes.rows[0];
		console.log('GROUPS - FIND ONE - group', group);

		if (!group) {
			const error = new ExpressError(
				`There exists no group with id '${id}'.`,
				404
			);
			throw error;
		}

		if (group.trees === null) group.trees = [];
		if (group.members[0].user_id === null) group.members = [];

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

	/**
	 * Group to Tree relationships
	 */

	/**Get all group-tree relations by group id. */
	static async getTrees(groupId) {
		const result = await db.query(
			`SELECT FROM groups_trees 
			WHERE group_id = $1 
			GROUP BY group_id`,
			[ groupId ]
		);
		return result;
	}
	/**Create a group to tree relationship, given group id and tree id. */
	static async addTree(groupId, treeId) {
		await db.query(
			`INSERT INTO groups_trees (group_id, tree_id) 
			VALUES ($1, $2)`,
			[ groupId, treeId ]
		);
	}
	/**Remove a group to tree relationship, given group id and tree id. */
	static async removeTree(groupId, treeId) {
		await db.query(
			`DELETE FROM groups_trees 
			WHERE group_id = $1
			AND tree_id = $2`,
			[ groupId, treeId ]
		);
	}

	/**
	 * Group to Members relationships
	 */

	/** Given a group id, return group moderators. */

	static async getModerators(groupId) {
		const groupRes = await db.query(
			`SELECT group_id, user_id, is_moderator
				FROM users_groups
				WHERE group_id = $1 AND is_moderator = true
				`,
			[ groupId ]
		);

		console.log('Group Model - getModerators - groupRes', groupRes);
		const groupModerators = groupRes.rows.map((item) => item.user_id);

		if (!groupModerators) {
			const error = new ExpressError(
				`There exists no group with id '${groupId}', or it has no moderators.`,
				404
			);
			throw error;
		}

		return groupModerators;
	}
}

module.exports = Group;
