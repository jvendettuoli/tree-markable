/**
 * This file will delete all Firebase Users and attempt to 
 * create generic Firebase Users and insert generic data into 
 * database. Be sure you know what you are doing before you run it!
 * 
 */

const db = require('./db');
const {
	createFirebaseUser,
	createAdmin,
	deleteFirebaseUser,
	listAllFirebaseUsers
} = require('./firebase/firebaseAuth');
const Tree = require('./models/tree');
const Comment = require('./models/comment');
const Group = require('./models/group');
const User = require('./models/user');

const defaultPhotoUrl = 'https://www.flaticon.com/svg/static/icons/svg/1946/1946429.svg';
const defaultHomeGeo = '-123.48034399738893,48.0913799544858';

const users = [
	{
		email         : 'jvend@gmail.com',
		emailVerified : false,
		password      : 'testpw1',
		displayName   : 'TU1',
		photoURL      : defaultPhotoUrl
	},
	{
		email         : 'melly@gmail.com',
		emailVerified : false,
		password      : 'testpw2',
		displayName   : 'TestU2',
		photoURL      : defaultPhotoUrl
	},
	{
		email         : 'sanders@gmail.com',
		emailVerified : false,
		password      : 'testpw3',
		displayName   : 'Test User Number Three',
		photoURL      : defaultPhotoUrl
	},
	{
		email         : 'test1@gmail.com',
		emailVerified : false,
		password      : 'testpw4',
		displayName   : 'Testie Testerson',
		photoURL      : defaultPhotoUrl
	},
	{
		email         : 'test2@gmail.com',
		emailVerified : false,
		password      : 'testpw5',
		displayName   : 'Tess Ter',
		photoURL      : defaultPhotoUrl
	}
];

let userRecords = [];

async function firebaseSeed(users) {
	try {
		//Delete existing Firebase users
		const firebaseUsers = await listAllFirebaseUsers();
		for (const user of firebaseUsers) {
			await deleteFirebaseUser(user.uid);
		}
		//Create Firebase user
		for (const user of users) {
			const result = await createFirebaseUser(user);
			if (result instanceof Error) {
				throw result;
			}
			userRecords.push(result);
		}
		//Make first user an admin
		const result = await createAdmin(userRecords[0].uid);
		if (result instanceof Error) {
			throw result;
		}
	} catch (err) {
		console.log(`Firebase Seed Error: ${err}`);
		process.exit(1);
	}
}

async function seed() {
	try {
		//Create users in tree-markable database

		for (let user of userRecords) {
			await db.query(
				`INSERT INTO users
				(firebase_id,
					username,
					email,
					img_url,
					home_geolocation,
					is_admin)
				VALUES
				($1, $2, $3, $4, $5, ${user.displayName === 'TU1'});`,
				[ user.uid, user.displayName, user.email, defaultPhotoUrl, defaultHomeGeo ]
			);
		}

		//Create new groups
		await db.query(
			`INSERT INTO groups
            (name, description, is_public, creator)
            VALUES
            ('TG1', 'Short Description.', true, $1),
			('TestG 3', 'A description for Test Group 2, which is a made up group for testing. This description is medium length in order to test formatting in the description area for formatting reasons.', true, $3),
            ('Test Group Two', 'A description for Test Group 2, which is a made up group for testing. This description is longer in order to test a longer description in the description area for formatting reasons. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', false, $2);`,
			[ userRecords[0].uid, userRecords[2].uid, userRecords[1].uid ]
		);
		//Select groups
		const groups = await Group.findAll();

		//Create users_groups
		await User.addGroup(userRecords[0].uid, groups[0].id, true);
		await User.addGroup(userRecords[0].uid, groups[1].id);
		await User.addGroup(userRecords[0].uid, groups[2].id);
		await User.addGroup(userRecords[1].uid, groups[0].id, true);
		await User.addGroup(userRecords[1].uid, groups[2].id, true);
		await User.addGroup(userRecords[2].uid, groups[1].id, true);
		await User.addGroup(userRecords[2].uid, groups[0].id);
		await User.addGroup(userRecords[3].uid, groups[0].id);
		await User.addGroup(userRecords[3].uid, groups[1].id);
		await User.addGroup(userRecords[3].uid, groups[2].id);
		await User.addGroup(userRecords[4].uid, groups[0].id);
		await User.addGroup(userRecords[4].uid, groups[1].id);

		//Create new trees
		await db.query(
			`INSERT INTO trees
            (name, common_name, scientific_name, description, geolocation, height, dsh, leaf_type, fruit_bearing, favorites, creator)
            VALUES
            ('Test Tree 1', 'Bigleaf Maple', 'Acer Macrophyllum', 'Beautiful bigleaf maple on the corner of 8th and 6th', '-123.48034399738893,48.0923799544858', 150, 25, 'deciduous', true,  0, $1),
            ('Test Tree 2', 'Cottonwood', 'Populus balsamifera', 'Beautiful cottonwood on the corner of 9th and 5th. Longer description for formatting testing to see how this fits in. How does this look on the page?', '-122.48034399738893,48.0913799544858', 200, 40, 'evergreen', false, 0, $2);`,
			[ userRecords[0].uid, userRecords[2].uid ]
		);

		//Create tree with minimum info
		await db.query(
			`INSERT INTO trees
            (name, geolocation, creator)
            VALUES
            ('TT3NoInfo','-123.48034399738893, 48.0913799544858', $1)`,
			[ userRecords[0].uid ]
		);

		//Select trees
		const trees = await Tree.findAll();

		//Create users_trees
		await User.addTree(userRecords[0].uid, trees[0].id);
		await User.addTree(userRecords[0].uid, trees[1].id);
		await User.addTree(userRecords[0].uid, trees[2].id);
		await User.addTree(userRecords[1].uid, trees[1].id);
		await User.addTree(userRecords[2].uid, trees[1].id);

		//Create groups_trees
		await Group.addTree(groups[0].id, trees[0].id);
		await Group.addTree(groups[0].id, trees[1].id);
		await Group.addTree(groups[0].id, trees[2].id);
		await Group.addTree(groups[1].id, trees[0].id);
		await Group.addTree(groups[1].id, trees[1].id);

		//Create comments
		await db.query(
			`INSERT INTO comments
            (text, author_name, author_id)
            VALUES
            ('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', $1, $2),
			('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 

			Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', $3, $4),
			('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', $1, $2),
			('Lorem ipsum', $3, $4)
			`,
			[ userRecords[0].displayName, userRecords[0].uid, userRecords[1].displayName, userRecords[1].uid ]
		);

		//Select comments
		const comments = await Comment.findAll();

		//Create trees_comments
		await db.query(
			`INSERT INTO trees_comments 
			(tree_id, comment_id)
			VALUES
			($1,$3), ($1, $4), ($1, $5), ($1, $6), ($2, $5)`,
			[ trees[0].id, trees[1].id, comments[0].id, comments[1].id, comments[2].id, comments[3].id ]
		);

		//Create groups_comments
		await db.query(
			`INSERT INTO groups_comments
			(group_id, comment_id)
			VALUES
			($1,$3), ($1, $4), ($1, $5), ($1, $6), ($2, $5)`,
			[ groups[0].id, groups[1].id, comments[0].id, comments[1].id, comments[2].id, comments[3].id ]
		);
	} catch (err) {
		console.log(`Database Seed Error: ${err}`);
		process.exit(1);
	}
}

(async function() {
	await firebaseSeed(users);
	console.log('Firebase Data seeded');

	await seed();
	console.log('Database seeded');
	process.exit(0);
})();
