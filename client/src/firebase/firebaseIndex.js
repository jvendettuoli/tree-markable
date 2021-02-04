import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/analytics';

// Setup Firebase configuration
const firebaseConfig = {
	apiKey            : process.env.REACT_APP_API_KEY,
	authDomain        : process.env.REACT_APP_AUTHDOMAIN,
	databaseURL       : process.env.REACT_APP_BASEURL,
	projectId         : process.env.REACT_APP_PROJECT_ID,
	storageBucket     : process.env.REACT_APP_STORAGEBUCKET,
	messagingSenderId : process.env.REACT_APP_MESSAGING_SENDER_ID,
	appId             : process.env.REACT_APP_APP_ID,
	measurementId     : process.env.REACT_APP_MEASUREMENT_ID
};

//Initialize Firebase and setup Authentication and Storage
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const storage = firebase.storage();

export { firebase, auth, storage };
