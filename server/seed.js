const db = require('./db');
const {
	createFirebaseUser,
	createAdmin
} = require('./firebase/firebaseAuth');

const users = [
	{
		email         : 'jvend@gmail.com',
		emailVerified : false,
		password      : 'testpw1',
		displayName   : 'TU1',
		photoURL      :
			'https://www.flaticon.com/svg/static/icons/svg/21/21104.svg'
	},
	{
		email         : 'melly@gmail.com',
		emailVerified : false,
		password      : 'testpw2',
		displayName   : 'TU2',
		photoURL      :
			'https://www.flaticon.com/svg/static/icons/svg/21/21104.svg'
	},
	{
		email         : 'sanders@gmail.com',
		emailVerified : false,
		password      : 'testpw3',
		displayName   : 'TU3',
		photoURL      :
			'https://www.flaticon.com/svg/static/icons/svg/21/21104.svg'
	}
];

let userRecords = [];

async function firebaseSeed(users) {
	try {
		for (const user of users) {
			const result = await createFirebaseUser(user);
			if (result instanceof Error) {
				throw result;
			}
			userRecords.push(result);
		}
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
		await db.query(
			`INSERT INTO users
            (firebase_id,
                username,
                email,
                img_url,
                home_geolocation,
                is_admin)
            VALUES
            ($1, $2, $3, 'https://www.flaticon.com/svg/static/icons/svg/21/21104.svg','-123.48034399738893,48.0913799544858', true),
            ($4, $5, $6,'https://www.flaticon.com/svg/static/icons/svg/21/21104.svg','-122.480343997234,48.0913799544858', false),
            ($7, $8, $9, 'https://www.flaticon.com/svg/static/icons/svg/21/21104.svg','-123.48034399738893,49.0913799544858', false);`,
			[
				userRecords[0].uid,
				userRecords[0].displayName,
				userRecords[0].email,
				userRecords[1].uid,
				userRecords[1].displayName,
				userRecords[1].email,
				userRecords[2].uid,
				userRecords[2].displayName,
				userRecords[2].email
			]
		);

		await db.query(
			`INSERT INTO groups
            (name, description, is_public, creator)
            VALUES
            ('TestGroup1', 'A description for Test Group 1, which is a made up group for testing.', true, $1),
            ('TestGroup2', 'A description for Test Group 2, which is a made up group for testing.', false, $2);`,
			[ userRecords[0].uid, userRecords[1].uid ]
		);

		await db.query(
			`INSERT INTO trees
            (name, common_name, scientific_name, description, geolocation, favorites, creator)
            VALUES
            ('Test Tree 1', 'Bigleaf Maple', 'Acer Macrophyllum', 'Beautiful bigleaf maple on the corner of 8th and 6th', '-123.48034399738893,49.0913799544858', 0, $1),
            ('Test Tree 2', 'Cottonwood', 'Populus balsamifera', 'Beautiful cottonwood on the corner of 9th and 5th', '-122.48034399738893,48.0913799544858', 0, $2);`,
			[ userRecords[0].uid, userRecords[2].uid ]
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
	process.exit();
})();
