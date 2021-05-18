/** Users Routes Tests */
const request = require('supertest');

process.env.NODE_ENV = 'test';
const app = require('../../app');
const User = require('../../models/user');
const getIdToken = require('../config/customFirebaseToken');
const {
	getFirebaseUsers,
	createFirebaseUser,
	createAdmin,
	updateUserInFirebase,
	deleteFirebaseUser,
	listAllFirebaseUsers
} = require('../../firebase/firebaseAuth');

const { afterAllSetup, afterEachSetup, beforeEachSetup, beforeAllSetup } = require('../config/setup');

const {
	testUserRecords,
	defaultPhotoUrl,
	defaultHomeGeo,
	userEmail,
	adminEmail,
	newUserEmail,
	testUsers,
	testTrees,
	testGroups,
	testComments
} = require('../config/testData');
const { update } = require('../../models/user');

/**
 * Given user data, this will create and update the user in Firebase.
 * Returns an IdToken and Firebase userRecordfor that user to be used 
 * with API requests that require authorization or authentication.
 * 
 * Removes password field and adds a firebase_id field to passed in userData object.
 */
const createAndUpdateFirebaseUser = async (userData) => {
	try {
		let userRecord = await createFirebaseUser(userData);
		userRecord = await updateUserInFirebase(userRecord.uid, userData);
		const res = await getIdToken({ uid: userRecord.uid, name: userData.username });
		const token = res.idToken;
		delete userData.password;
		userData.firebase_id = userRecord.uid;
		return { token, userRecord };
	} catch (err) {
		throw err;
	}
};

beforeAll(async () => {
	jest.spyOn(console, 'debug').mockImplementation(jest.fn());
	jest.spyOn(console, 'log').mockImplementation(jest.fn());
	await beforeAllSetup(testUsers, testUserRecords);
});

// Definied globally for use in all tests. Populated with data from
// beforeEach function.
let expectedUser, expectedAdmin, expectedPatchUser;

beforeEach(async () => {
	await beforeEachSetup(testUserRecords, testUsers, defaultPhotoUrl, defaultHomeGeo, testTrees);
	expectedUser = {
		firebase_id      : testUserRecords[0].uid,
		username         : testUsers.user.username,
		email            : testUsers.user.email,
		img_url          : defaultPhotoUrl,
		home_geolocation : {
			x : Number(defaultHomeGeo.split(',')[0]),
			y : Number(defaultHomeGeo.split(',')[1])
		},
		is_admin         : testUsers.user.is_admin,
		created_at       : expect.anything()
	};
	expectedAdmin = {
		firebase_id      : testUserRecords[1].uid,
		username         : testUsers.admin.username,
		email            : testUsers.admin.email,
		img_url          : defaultPhotoUrl,
		home_geolocation : {
			x : Number(defaultHomeGeo.split(',')[0]),
			y : Number(defaultHomeGeo.split(',')[1])
		},
		is_admin         : testUsers.admin.is_admin,
		created_at       : expect.anything()
	};
	expectedPatchUser = {
		firebase_id      : testUserRecords[2].uid,
		username         : testUsers.patch.username,
		email            : testUsers.patch.email,
		img_url          : defaultPhotoUrl,
		home_geolocation : {
			x : Number(defaultHomeGeo.split(',')[0]),
			y : Number(defaultHomeGeo.split(',')[1])
		},
		is_admin         : testUsers.patch.is_admin,
		created_at       : expect.anything()
	};
});

/**
 * GET
 */

describe('GET /api/users', function() {
	test('Get a list of all users with valid token', async function() {
		console.debug('GET /api/users - Get a list of all users with valid token - Start');
		const res = await request(app).get('/api/users');

		expect(res.statusCode).toBe(200);
		expect(res.body.users).toEqual(expect.arrayContaining([ expectedUser, expectedAdmin, expectedPatchUser ]));
	});

	// Enable only if auth middleware placed on this route
	// test('Receive 401 status with invalid token', async function() {
	// 	const res = await request(app).get('/api/users').send({ _token: 'Invalid Token' });

	// 	expect(res.statusCode).toBe(401);
	// });
});

describe('GET /api/users/:username', function() {
	test('Get a user with valid token', async function() {
		console.debug('GET /api/users/:username - Get a user with valid token - Start');

		const res = await request(app).get(`/api/users/${testUsers.user.username}`);
		expectedUser.saved_tree_ids = null;
		expectedUser.followed_group_ids = null;
		expect(res.statusCode).toBe(200);
		expect(res.body.user).toEqual(expectedUser);
	});

	// Enable only if auth middleware placed on this route
	// test('Receive 401 status with invalid token', async function() {
	// 	const res = await request(app).get(`/api/users/${testUser.user.username}`.send({ _token: 'Invalid Token' });

	// 	expect(res.statusCode).toBe(401);
	// });
});

/**
 * POST
 */

describe('POST /api/users', function() {
	const newUser = {
		username : 'New User',
		password : 'testpw3',
		email    : `${newUserEmail}@test.com`,
		img_url  : defaultPhotoUrl,
		is_admin : false
	};

	test('Create a new user with valid token', async function() {
		console.debug('POST /api/users - Create a new user with valid token - Start');

		//Create and update newUser in Firebase. Prep data for create new user POST
		const { token, userRecord: newUserRecord } = await createAndUpdateFirebaseUser(newUser);

		const res = await request(app).post('/api/users').send({ _token: token, ...newUser });
		const expectedNewUser = {
			firebase_id      : newUserRecord.uid,
			username         : newUser.username,
			email            : newUser.email,
			img_url          : defaultPhotoUrl,
			home_geolocation : null,
			is_admin         : newUser.is_admin,
			created_at       : expect.anything() //For some reason this returns a String or Date, the opposite of whatever I check for
		};

		// Delete new user from Firebase to avoid cluttering Firebase Auth
		await deleteFirebaseUser(expectedNewUser.firebase_id);

		expect(res.statusCode).toBe(201);
		expect(res.body.newUser).toEqual(expectedNewUser);
		const queriedUser = await User.findByUid(newUser.firebase_id);
		expectedNewUser.saved_tree_ids = null;
		expectedNewUser.followed_group_ids = null;
		expect(queriedUser).toEqual(expectedNewUser);
	});

	test('Returns 400 for existing username', async function() {
		console.debug('POST /api/users - Returns 400 for existing username - Start');
		// Establish a user in Firebase that has a duplicate username
		const duplicateUser = {
			username  : 'Test User 1',
			password  : 'testpw1',
			email     : `${newUserEmail}@test.com`,
			photo_url : defaultPhotoUrl,
			is_admin  : false
		};

		const { token, userRecord } = await createAndUpdateFirebaseUser(duplicateUser);

		// Match data to expected JSON for validation
		duplicateUser.img_url = duplicateUser.photo_url;
		delete duplicateUser.photo_url;

		const res = await request(app).post('/api/users').send({ _token: token, ...duplicateUser });

		// Delete new Firebase user
		await deleteFirebaseUser(userRecord.uid);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toEqual('Duplicate username found.');
	});

	test('Receive 401 status with invalid token', async function() {
		console.debug('POST /api/users - Receive 401 status with invalid token - Start');

		const res = await request(app).post('/api/users').send({ _token: 'Invalid Token' });

		expect(res.statusCode).toBe(401);
	});
});

/**
 * PATCH
 */

describe('PATCH /api/users/:username', function() {
	const userPatchData = {
		username : 'Patched User',
		email    : `${newUserEmail}@test.com`
	};

	test('Patch a user with a valid token', async function() {
		console.debug('PATCH /api/users/:username - Patch a user with valid token - Start');

		// Get token for existing user
		const { idToken } = await getIdToken({ uid: expectedPatchUser.firebase_id, name: expectedPatchUser.username });
		const token = idToken;
		const res = await request(app)
			.patch(`/api/users/${testUsers.patch.username}`)
			.send({ _token: token, ...userPatchData });

		expectedPatchUser = {
			...expectedPatchUser,
			...userPatchData
		};

		expect(res.statusCode).toBe(200);
		expect(res.body.user).toEqual(expectedPatchUser);
		const queriedUser = await User.findByUid(expectedPatchUser.firebase_id);
		expectedPatchUser.saved_tree_ids = null;
		expectedPatchUser.followed_group_ids = null;
		expect(queriedUser).toEqual(expectedPatchUser);
	});

	test('Returns 400 for existing username', async function() {
		console.debug('PATCH /api/users/:username - Returns 400 for existing username - Start');

		// Get token for existing user
		const { idToken } = await getIdToken({ uid: expectedPatchUser.firebase_id, name: expectedPatchUser.username });
		const token = idToken;
		const res = await request(app)
			.patch(`/api/users/${testUsers.patch.username}`)
			.send({ _token: token, username: testUsers.user.username });

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toEqual('Duplicate username found.');
	});

	test('Receive 400 status for existing email', async function() {
		console.debug('PATCH /api/users/:username - Returns 400 for existing email - Start');

		// Get token for existing user
		const { idToken } = await getIdToken({ uid: expectedPatchUser.firebase_id, name: expectedPatchUser.username });
		const token = idToken;
		const res = await request(app)
			.patch(`/api/users/${testUsers.patch.username}`)
			.send({ _token: token, email: testUsers.user.email });

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toEqual('Duplicate email found.');
	});

	test('Receive 401 status with invalid token', async function() {
		console.debug('PATCH /api/users/:username - Receive 401 status with invalid token - Start');

		const res = await request(app).post('/api/users').send({ _token: 'Invalid Token' });

		expect(res.statusCode).toBe(401);
	});
});

/**
 * DELETE
 */

describe('DELETE /api/users/:username', function() {
	test('Receive 200 status with a valid token', async function() {
		console.debug('DELETE /api/users/:username - Receive 200 status with a valid token - Start');
		const { idToken } = await getIdToken({ uid: expectedUser.firebase_id });
		const token = idToken;
		const res = await request(app).delete(`/api/users/${testUsers.user.username}`).send({ _token: token });

		expect(res.statusCode).toBe(200);
		expect(res.body.message).toEqual(`User '${testUsers.user.username}' deleted`);
	});

	test('Receive 401 status with wrong user', async function() {
		console.debug('DELETE /api/users/:username - Receive 200 status with a valid token - Start');
		const { idToken } = await getIdToken({ uid: expectedUser.firebase_id });
		const token = idToken;

		//Try to delete admin as different user
		const res = await request(app).delete(`/api/users/${testUsers.admin.username}`).send({ _token: token });

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toEqual(
			`Must be user '${testUsers.admin.username}' or admin to access this endpoint.`
		);
	});

	test('Receive 200 status with a valid token', async function() {
		console.debug('DELETE /api/users/:username - Receive 401 status with invalid token - Start');

		const res = await request(app)
			.delete(`/api/users/${testUsers.user.username}`)
			.send({ _token: 'Invalid Token' });

		expect(res.statusCode).toBe(401);
	});
});

afterEach(async function() {
	await afterEachSetup();
});
afterAll(async function() {
	await afterAllSetup(testUserRecords);
});
