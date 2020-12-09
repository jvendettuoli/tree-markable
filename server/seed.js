const db = require('./db');

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
            ('4ygMAIxZg0g45w5h6uMmjGqfUVC2','TestUser1', 'jvend@gmail.com', 'https://www.flaticon.com/svg/static/icons/svg/21/21104.svg','-123.48034399738893,48.0913799544858', true),
            ('XxpNYSGC0aR9Yzg7rVYmp3fRYCo1','TestUser2', 'melly@gmail.com', 'https://www.flaticon.com/svg/static/icons/svg/21/21104.svg','-122.480343997234,48.0913799544858', false),
            ('ZRcG1ZJmunVcc7viYB2PjPzyrAg2','TestUser3', 'sanders@gmail.com', 'https://www.flaticon.com/svg/static/icons/svg/21/21104.svg','-123.48034399738893,49.0913799544858', false)`
		);

		await db.query(
			`INSERT INTO groups
            (name, description, storage_url, is_public, creator)
            VALUES
            ('TestGroup1', 'A description for Test Group 1, which is a made up group for testing.','gs://tree-markable.appspot.com/images/groups/1', true,'4ygMAIxZg0g45w5h6uMmjGqfUVC2'),
            ('TestGroup2', 'A description for Test Group 2, which is a made up group for testing.','gs://tree-markable.appspot.com/images/groups/2', false,'XxpNYSGC0aR9Yzg7rVYmp3fRYCo1')`
		);

		await db.query(
			`INSERT INTO trees
            (name, common_name, scientific_name, description, storage_url, geolocation, favorites, creator)
            VALUES
            ('Test Tree 1', 'Bigleaf Maple', 'Acer Macrophyllum', 'Beautiful bigleaf maple on the corner of 8th and 6th','gs://tree-markable.appspot.com/images/tree/1', '-123.48034399738893,49.0913799544858', 0, '4ygMAIxZg0g45w5h6uMmjGqfUVC2'),
            ('Test Tree 2', 'Cottonwood', 'Populus balsamifera', 'Beautiful cottonwood on the corner of 9th and 5th','gs://tree-markable.appspot.com/images/tree/2', '-122.48034399738893,48.0913799544858', 0, 'ZRcG1ZJmunVcc7viYB2PjPzyrAg2')`
		);
	} catch (e) {
		console.log(`Error: ${e}`);
		process.exit(1);
	}
}
seed().then(() => {
	console.log('Data seeded');
	process.exit();
});
