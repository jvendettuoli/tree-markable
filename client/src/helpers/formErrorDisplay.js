/**
 * Helper for showing errors returned from Firebase or API for form inputs
 *  
 */

const errorDisplay = (field, error) => {
	if (error === null || error.length === 0) return undefined;
	const status = Number.isInteger(error[0].status) ? error[0].message : error[0].status;
	let errors = new Map();
	if (field === 'username') {
		errors.set('Duplicate username found.', 'Duplicate username found.');
	}
	if (field === 'group_name') {
		errors.set('Duplicate group name found.', 'Duplicate group name found.');
	}
	if (field === 'email') {
		errors.set('auth/email-already-in-use', 'The email address is already in use by another account.');
		errors.set('auth/invalid-email', 'The email address is badly formatted.');
		errors.set('auth/user-not-found', 'There is no user corresponding to the given email.');
		errors.set('Duplicate email found.', 'Duplicate email found.');
	}
	if (field === 'password') {
		errors.set('auth/weak-password', 'Password is too weak. Must be greater than 6 characters.');
		errors.set('auth/wrong-password', 'Wrong password.');
	}
	if (field === 'new_password') {
		errors.set('auth/weak-password', 'Password is too weak. Must be greater than 6 characters.');
	}
	// console.log('status', status);
	// console.log('errors', errors);
	// console.log('errors.get(status)', errors.get(status));
	return errors.get(status);
};

export { errorDisplay };
