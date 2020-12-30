const db = require('../db');
const ExpressError = require('../helpers/expressError');
const partialUpdate = require('../helpers/partialUpdate');
const formatCoordinates = require('../helpers/formatCoordinates');

/** Related functions for trees. */

class Tree {
	/** Create tree with data. Returns new tree data. */

	static async create(data) {
		console.log('Models - Tree.create - Start');
		console.log('Models - Tree.create - data', data);

		// Convert coordinates into Point format for Postgresql: 'x,y'
		const geolocation = formatCoordinates(data.geolocation);

		try {
			const result = await db.query(
				`INSERT INTO trees 
              (name, common_name, scientific_name, height, dsh, leaf_type, description, geolocation, creator) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING id, name, common_name, scientific_name, height, dsh, leaf_type, description, geolocation, favorites, creator, created_at`,
				[
					data.name,
					data.common_name,
					data.scientific_name,
					data.height,
					data.dsh,
					data.leaf_type,
					data.description,
					geolocation,
					data.creator
				]
			);

			return result.rows[0];
		} catch (err) {
			throw new ExpressError(err.message, 400);
		}
	}

	/** Find all trees. */

	static async findAll() {
		const result = await db.query(
			`SELECT id, name, common_name, scientific_name, height, dsh, leaf_type, description, geolocation, favorites, creator, created_at
          FROM trees
          ORDER BY name`
		);

		return result.rows;
	}

	/** Given a tree id, return data about tree. */

	static async findOne(id) {
		const treeRes = await db.query(
			`SELECT id, name, common_name, scientific_name, height, dsh, leaf_type, description, geolocation, favorites, creator, created_at
            FROM trees 
            WHERE id = $1`,
			[ id ]
		);

		const tree = treeRes.rows[0];

		if (!tree) {
			const error = new ExpressError(
				`There exists no tree with id '${id}'.`,
				404
			);
			throw error;
		}

		return tree;
	}

	/** Update tree data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Return data for changed tree.
   *
   */

	static async update(id, data) {
		if (data.hasOwnProperty('geolocation')) {
			data.geolocation = formatCoordinates(data.geolocation);
		}

		let { query, values } = partialUpdate('trees', data, 'id', id);

		const result = await db.query(query, values);
		const tree = result.rows[0];

		if (!tree) {
			let notFound = new ExpressError(
				`There exists no tree with id: '${id}'`,
				404
			);
			throw notFound;
		}

		return result.rows[0];
	}

	/** Delete given tree from database; returns undefined. */

	static async remove(id) {
		let result = await db.query(
			`DELETE FROM trees 
                WHERE id = $1
                RETURNING id`,
			[ id ]
		);

		if (result.rows.length === 0) {
			let notFound = new ExpressError(
				`There exists no tree with id: '${id}'`,
				404
			);
			throw notFound;
		}
	}
}

module.exports = Tree;
