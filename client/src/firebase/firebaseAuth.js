import auth from './firebaseIndex';

const signup = (email, password) => {
	auth
		.createUserWithEmailAndPassword(email, password)
		.then((user) => {
			console.log('signup successful');
		})
		.catch((error) => {
			const errorCode = error.errorCode;
			const errorMessage = error.message;
			console.log('Error', errorCode, errorMessage);
		});
};

export { signup };
