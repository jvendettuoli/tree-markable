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

	/** Find all trees based on queries supplied. With no passed queries
	 * will return all trees. */

	static async findAll(queries) {
		console.log('findAll - queries', queries);

		// Validate min and max dsh
		if (queries.dsh_min >= queries.dsh_max) {
			throw new ExpressError(
				'Query parameters are invalid. Minimum dsh must be less than maximum dsh.',
				400
			);
		}
		// Validate min and max height
		if (queries.height_min >= queries.height_max) {
			throw new ExpressError(
				'Query parameters are invalid. Minimum height must be less than maximum height.',
				400
			);
		}

		let queryIdx = 1;
		let whereStatements = [];
		let queryValues = [];
		let baseQuery = `SELECT id, name, common_name, scientific_name, height, dsh, leaf_type, description, geolocation, favorites, creator, created_at
		FROM trees`;

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
				`to_tsvector(name) || to_tsvector(coalesce(common_name, '')) || to_tsvector(coalesce(scientific_name, ''))  @@ phraseto_tsquery($${queryIdx})`,
				queries.search
			);
		}
		if (queries.distance) {
			const map_center = `point('-123.45642432008287', '48.1946608947504')`;

			baseQuery = `SELECT id, name, common_name, scientific_name, height, dsh, leaf_type, description, geolocation, favorites, creator, created_at, (geolocation<@>${map_center}) as distance
			FROM trees`;
			whereStatements.push(
				`(geolocation<@>${map_center}) <  $${queryIdx}`
			);
			queryIdx += 1;
			queryValues.push(queries.distance);
		}
		if (queries.dsh_min) {
			addQueryParam(`dsh >= $${queryIdx}`, queries.dsh_min);
		}
		if (queries.dsh_max) {
			addQueryParam(`dsh <= $${queryIdx}`, queries.dsh_max);
		}
		if (queries.height_min) {
			addQueryParam(`height >= $${queryIdx}`, queries.height_min);
		}
		if (queries.height_max) {
			addQueryParam(`height <= $${queryIdx}`, queries.height_max);
		}
		if (queries.leaf_type) {
			addQueryParam(`leaf_type = $${queryIdx}`, queries.leaf_type);
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

		console.log(finalQuery, queryValues);
		return results.rows;
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
