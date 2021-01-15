const db = require('../db');
const ExpressError = require('../helpers/expressError');
const partialUpdate = require('../helpers/partialUpdate');

const TREES = 'trees';
const GROUPS = 'groups';

/** Related functions for comments. */

class Comment {
	/** Create comment with data. Returns new comment data. */

	static async create(data) {
		console.log('Models - Comment.create - Start');
		console.log('Models - Comment.create - data', data);

		try {
			const result = await db.query(
				`INSERT INTO comments 
              (text, author) 
            VALUES ($1, $2) 
            RETURNING id, text, author, created_at`,
				[ data.text, data.author ]
			);

			// Add Comment to relationship table
			if (data.type === TREES)
				Comment.addCommentOnTree(data.id, result.rows[0].id);
			if (data.type === GROUPS)
				Comment.addCommentOnTree(data.id, result.rows[0].id);

			return result.rows[0];
		} catch (err) {
			throw new ExpressError(err.message, 400);
		}
	}

	/** Find all comments. */

	static async findAll() {
		const result = await db.query(
			`SELECT id, text, author, created_at
          FROM comments
          ORDER BY created_at`
		);

		return result.rows;
	}

	/** Given a comment id, return data about comment. */

	static async findOne(id) {
		const commentRes = await db.query(
			`SELECT id, text, author, created_at
			FROM comments
			WHERE id = $1
			ORDER BY created_at`,
			[ id ]
		);

		const comment = commentRes.rows[0];

		if (!comment) {
			const error = new ExpressError(
				`There exists no comment with id '${id}'.`,
				404
			);
			throw error;
		}

		return comment;
	}

	/** Update comment data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Return data for changed comment.
   *
   */

	static async update(id, data) {
		let { query, values } = partialUpdate('comments', data, 'id', id);

		const result = await db.query(query, values);
		const comment = result.rows[0];

		if (!comment) {
			let notFound = new ExpressError(
				`There exists no comment with id: '${id}'`,
				404
			);
			throw notFound;
		}

		return result.rows[0];
	}

	/** Delete given comment from database; returns undefined. */

	static async remove(id) {
		let result = await db.query(
			`DELETE FROM comments 
                WHERE id = $1
                RETURNING id`,
			[ id ]
		);

		if (result.rows.length === 0) {
			let notFound = new ExpressError(
				`There exists no comment with id: '${id}'`,
				404
			);
			throw notFound;
		}
	}

	/**
	 * Comment on Trees relationships
	 */
	/** Add Comment to a Tree */
	static async addCommentOnTree(treeId, commentId) {
		await db.query(
			`INSERT INTO trees_comments 
			(tree_id, comment_id)
			VALUES ($1, $2)
			`,
			[ treeId, commentId ]
		);
	}
}

module.exports = Comment;
