/**
 * Setup for integration tests. 
 * Creates two Firebase users.
 * Creates standard user, admin user, two trees, two groups, two comments, and 
 * relations in database.
 */
const {
	getFirebaseUsers,
	createFirebaseUser,
	createAdmin,
	updateUserInFirebase,
	deleteFirebaseUser,
	listAllFirebaseUsers
} = require('../../firebase/firebaseAuth');
const getIdToken = require('./customFirebaseToken');

process.env.NODE_ENV = 'test';
const db = require('../../db');

/*******************************************************************
 * Test Data
 *******************************************************************/
const {
	testUserRecords,
	defaultPhotoUrl,
	defaultHomeGeo,
	userEmail,
	adminEmail,
	testUsers,
	testTrees,
	testGroups,
	testComments
} = require('./testData');

/*******************************************************************
 * Functions for adding data to Firebase and TreeMarkable Database
 *******************************************************************/

// Add test users to Firebase
const firebaseSeed = async (testUsers, testUserRecords) => {
	console.debug(`TreeMarkable Tests Setup - firebaseSeed - Start`);

	try {
		let firebaseUserCount = 0;
		//Create Firebase user
		for (const user of Object.values(testUsers)) {
			const result = await createFirebaseUser(user);
			if (result instanceof Error) {
				throw result;
			}
			firebaseUserCount++;
			testUserRecords.push(result);
		}

		//Update Firebase with user data
		for (let i = 0; i < Object.values(testUsers).length; i++) {
			const result = await updateUserInFirebase(testUserRecords[i].uid, Object.values(testUsers)[i]);
			if (result instanceof Error) {
				throw result;
			}
			testUserRecords.push(result);
		}

		//Remove outdated Firebase User Records
		for (let i = 0; i < firebaseUserCount; i++) testUserRecords.shift();

		//Make first user an admin
		const result = await createAdmin(testUserRecords[0].uid);
		if (result instanceof Error) {
			throw result;
		}
	} catch (err) {
		console.error(`TreeMarkable Tests Setup - firebaseSeed - ${err}`);
		throw err;
	}
};

//Create users in tree_markable_test database, using test user data and Firebase User records
async function seedTestUserData(testUserRecords, testUsers, defaultPhotoUrl, defaultHomeGeo) {
	console.debug(`TreeMarkable Tests Setup - seedTestUserData - Start`);
	try {
		// Create users in tree_markable_test database. Requires Firebase users to have
		// been created first
		for (let user of testUserRecords) {
			await db.query(
				`INSERT INTO users
            (firebase_id,
                username,
                email,
                img_url,
                home_geolocation,
                is_admin)
            VALUES
            ($1, $2, $3, $4, $5, ${user.displayName === testUsers.admin.username});`,
				[ user.uid, user.displayName, user.email, defaultPhotoUrl, defaultHomeGeo ]
			);
		}
	} catch (err) {
		console.error(`TreeMarkable Tests Setup - seedTestUserData - ${err}`);
		throw err;
	}
}

//Create users in tree_markable_test database, using test user data and Firebase User records
async function seedTestTreeData(testTrees) {
	console.debug(`TreeMarkable Tests Setup - seedTestTreeData - Start`);
	try {
		// Create trees in tree_markable_test database. Requires Firebase users to have
		// been created first, to use firebase uid in creator field
		for (let tree of testTrees) {
			await db.query(
				`INSERT INTO trees
                (name, common_name, scientific_name, description, geolocation, height, dsh, leaf_type, fruit_bearing, favorites, creator)
                VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
				Object.values(tree)
			);
		}
	} catch (err) {
		console.error(`TreeMarkable Tests Setup - seedTestTreeData - ${err}`);
		throw err;
	}
}

//Create groups in tree_markable_test database
async function seedTestGroupData(testGroups) {
	console.debug(`TreeMarkable Tests Setup - seedTestGroupData - Start`);
	try {
		// Create groups in tree_markable_test database. Requires Firebase users to have
		// been created first, to use firebase uid in creator field
		for (let group of testGroups) {
			await db.query(
				`INSERT INTO groups
                (name, description, is_public, creator)
                VALUES
                ($1, $2, $3, $4);`,
				Object.values(group)
			);
		}
	} catch (err) {
		console.error(`TreeMarkable Tests Setup - seedTestGroupData - ${err}`);
		throw err;
	}
}
//Create comments in tree_markable_test database
async function seedTestCommentData(testComments) {
	console.debug(`TreeMarkable Tests Setup - seedTestCommentData - Start`);
	try {
		// Create comments in tree_markable_test database. Requires Firebase users to have
		// been created first, to use firebase uid in author_id field
		for (let comment of testComments) {
			await db.query(
				`INSERT INTO comments
                (text, author_name, author_id)
                VALUES
                ($1, $2, $3);`,
				Object.values(comment)
			);
		}
	} catch (err) {
		console.error(`TreeMarkable Tests Setup - seedTestCommentData - ${err}`);
		throw err;
	}
}

/*******************************************************************
 * Jest setup and tear down functions
 *******************************************************************/

// Once before running all tests create the test Firebase Users
const beforeAllSetup = async (testUsers, testUserRecords) => {
	console.debug(`TreeMarkable Tests Setup - beforeAllSetup - Start`);
	console.log(`TreeMarkable Tests Setup - beforeAllSetup - testUsers: ${testUsers}`);
	try {
		await firebaseSeed(testUsers, testUserRecords);
	} catch (err) {
		console.error(`TreeMarkable Tests Setup - beforeAllSetup - ${err}`);
		throw err;
	}
};

// Before each test seed test data into the test database
async function beforeEachSetup(testUserRecords, testUsers, defaultPhotoUrl, defaultHomeGeo, testTrees) {
	try {
		console.debug('TreeMarkable Tests Setup- beforeEachSetup - Start');
		//Create Users
		await seedTestUserData(testUserRecords, testUsers, defaultPhotoUrl, defaultHomeGeo);

		//Replace null value for creator with user id
		testTrees.tree1.creator = testUserRecords[0].uid;
		testTrees.tree2.creator = testUserRecords[1].uid;
		testGroups.group1.creator = testUserRecords[0].uid;
		testGroups.group2.creator = testUserRecords[1].uid;
		testComments.comment1.author_id = testUserRecords[0].uid;
		testComments.comment2.author_id = testUserRecords[1].uid;

		//Create Trees
		await seedTestTreeData(Object.values(testTrees));

		//Create Groups
		await seedTestGroupData(Object.values(testGroups));

		//Create Comments
		await seedTestCommentData(Object.values(testComments));
	} catch (err) {
		console.error(`TreeMarkable Tests Setup - beforeEachSetup - ${err}`);
		throw err;
	}
}

async function afterEachSetup() {
	console.debug(`TreeMarkable Tests Setup - afterEachSetup - Start`);
	try {
		for (const user of testUserRecords) {
			await deleteFirebaseUser(user.uid);
		}

		await db.query('DELETE FROM users');
		await db.query('DELETE FROM trees');
		await db.query('DELETE FROM groups');
		await db.query('DELETE FROM comments');
	} catch (err) {
		console.error(`TreeMarkable Tests Setup - afterEachSetup - ${err}`);
		throw err;
	}
}

async function afterAllSetup(testUserRecords) {
	console.debug(`TreeMarkable Tests Setup - afterAllSetup - Start`);
	try {
		await db.end();
	} catch (err) {
		console.error(`TreeMarkable Tests Setup - afterAllSetup - ${err}`);
		throw err;
	}
}

/**
 * For testing setup file. Commented out for general tests.
 */

// (async function(testUsers, testUserRecords, testTrees) {
// 	console.debug(`TreeMarkable Tests Setup - Main - Start`);
// 	try {
// 		await beforeAllSetup(testUsers, testUserRecords);
// 		await beforeEachSetup(testUserRecords, testUsers, defaultPhotoUrl, defaultHomeGeo, testTrees);
// 		await afterAllSetup(testUserRecords);
// 		console.debug(`TreeMarkable Tests Setup - Main - Database Successfully Seeded`);

// 		process.exit(1);
// 	} catch (err) {
// 		console.error(`TreeMarkable Tests Setup - Main - ${err}`);
// 		// Remove Firebase Users if they have been created and error occurs
// 		for (const user of testUserRecords) {
// 			await deleteFirebaseUser(user.uid);
// 		}
// 		console.debug('TreeMarkable Tests Setup - Main - Firebase Users Deleted');
// 		await db.query('DELETE FROM users');
// 		await db.query('DELETE FROM trees');
// 		await db.query('DELETE FROM groups;');
// 		await db.query('DELETE FROM comments;');
// 		await db.end();
// 		process.exit(1);
// 	}
// })(testUsers, testUserRecords, testTrees, testGroups, defaultHomeGeo, defaultPhotoUrl);

module.exports = {
	beforeAllSetup,
	beforeEachSetup,
	afterEachSetup,
	afterAllSetup
};
