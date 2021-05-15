const { v4: uuidv4 } = require('uuid');

/*******************************************************************
 * Test Data
 *******************************************************************/

const defaultPhotoUrl = 'https://www.flaticon.com/svg/static/icons/svg/1946/1946429.svg';
const defaultHomeGeo = '-123.48034399738893,48.0913799544858';

// Generate unique ID for use as email, to avoid conflict with existing Firebase emails
const userEmail = uuidv4();
const adminEmail = uuidv4();
const newUserEmail = uuidv4();

// Test users to be added to Firebase Auth and database
const testUsers = {
	user  : {
		username  : 'Test User 1',
		password  : 'testpw1',
		email     : `${userEmail}@test.com`,
		photo_url : defaultPhotoUrl,
		is_admin  : false
	},

	admin : {
		username  : 'Test User 2',
		password  : 'testpw2',
		email     : `${adminEmail}@test.com`,
		photo_url : defaultPhotoUrl,
		is_admin  : true
	}
};

// Empty array to push userRecord objects from Firebase returned from user creation.
let testUserRecords = [];

//Test tree data
const testTrees = {
	tree1 : {
		name            : 'Test Tree 1',
		common_name     : 'Bigleaf Maple',
		scientific_name : 'Acer Macrophyllum',
		description     :
			'Beautiful bigleaf maple on the corner of 8th and 6th. Large spreading limbs make it a great climbing tree!',
		geolocation     : '-123.48034399738893,48.0923799544858',
		height          : 150,
		dsh             : 25,
		leaf_type       : 'deciduous',
		fruit_bearing   : false,
		favorites       : 0,
		creator         : null
	},
	tree2 : {
		name            : 'Test Tree 2',
		common_name     : 'Pacific Crabapple',
		scientific_name : 'Malus fusca',
		description     : 'This tree has tart apples.',
		geolocation     : '-122.48034399738893,49.0913799544858',
		height          : 25,
		dsh             : 10,
		leaf_type       : 'deciduous',
		fruit_bearing   : true,
		favorites       : 0,
		creator         : null
	}
};

// Test group data
const testGroups = {
	group1 : {
		name        : 'Test Group 1',
		description :
			'A description for Test Group 2, which is a made up group for testing. This description is medium length in order to test formatting in the description area for formatting reasons.',
		is_public   : 'true',
		creator     : null
	},
	group2 : {
		name        : 'Test Group 2',
		description :
			'A description for Test Group 2, which is a made up group for testing. This description is longer in order to test a longer description in the description area for formatting reasons. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		is_public   : 'false',
		creator     : null
	}
};

// Test comment data
const testComments = {
	comment1 : {
		text        :
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		author_name : testUsers.user.username,
		author_id   : null
	},
	comment2 : {
		text        : `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
 
         Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
		author_name : testUsers.admin.username,
		author_id   : null
	}
};

module.exports = {
	testUserRecords,
	defaultPhotoUrl,
	defaultHomeGeo,
	userEmail,
	newUserEmail,
	adminEmail,
	testUsers,
	testTrees,
	testGroups,
	testComments
};
