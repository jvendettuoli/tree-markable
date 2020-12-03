/** Shared config for application; can be req'd many places. */

require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || 'test';

const PORT = +process.env.PORT || 3001;

const BCRYPT_WORK_FACTOR = 12;

/*
database is:

- on Heroku, get from env var DATABASE_URL
- in testing, 'tree-markable-test'
- else: 'tree-markable'
*/

let DB_URI;

if (process.env.NODE_ENV === 'test') {
	DB_URI = process.env.TEST_DATABASE_URL || 'tree-markable-test';
}
else {
	DB_URI = process.env.DATABASE_URL || 'tree-markable';
}

module.exports = {
	SECRET_KEY,
	PORT,
	DB_URI,
	BCRYPT_WORK_FACTOR
};
