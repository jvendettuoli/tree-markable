const sqlForPartialUpdate = require('../../helpers/partialUpdate');

describe('partialUpdate()', () => {
	it('should generate a proper partial update query with just 1 field', function() {
		const { query, values } = sqlForPartialUpdate('trees', { name: 'Test Tree', height: 100 }, 'id', 1);
		expect(query).toEqual('UPDATE trees SET name=$1, height=$2 WHERE id=$3 RETURNING *');
		expect(values).toEqual([ 'Test Tree', 100, 1 ]);
	});
});
