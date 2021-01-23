import { storage } from './firebaseIndex';

// Firebase Storage References
const storageRef = storage.ref();
const treesRef = storageRef.child('trees');
const usersRef = storageRef.child('users');
const groupsRef = storageRef.child('groups');

// Establish some naming conventions
const IMAGES = 'images';
const PRIMARY = 'primary';
const ALBUM = 'album';

/**
 * uploadImagesToFirebase
 * 
 * Uploads images to Firebase Storage based on a given 
 * storage.ref, and id for the tree, user, or group, and and array
 * of files.
 * 
 * collectionRef is a Firebase storage reference, id is a string 
 * of the id where the images will be stored, and files is an 
 * array of File objects.
 **/

const uploadImagesToFirebase = async (collectionRef, id, files) => {
	console.log(
		'uploadImagesToFirebase - Start:',
		collectionRef,
		id,
		files
	);
	for (let idx = 0; idx < files.length; idx++) {
		let imageRef;
		if (idx === 0) {
			imageRef = collectionRef.child(
				`${id}/${IMAGES}/${PRIMARY}/${files[idx].name}`
			);
		}
		else {
			imageRef = collectionRef.child(
				`${id}/${IMAGES}/${ALBUM}/${files[idx].name}`
			);
		}
		try {
			const res = await imageRef.put(files[idx]);
			console.log('STORAGE -res', res);
		} catch (err) {
			console.log('uploadImagesToFirebase - err', err);
		}
	}
};

/**
 *  listImagePathsFromFirebase
 * 
 * Uses Firebase Storage .listAll() method to list all prefixes
 * and items for a given storage ref.
 * 
 * Takes a storage ref and item id to get the image paths for
 * the primary and album images.
 * 
 * Returns an object {primary: 'imagePath', album:['imagePath1,...']}
 */
const listImagePathsFromFirebase = async (collectionRef, id) => {
	console.log('listImagePathsFromFirebase', collectionRef, id);

	try {
		const primaryRef = collectionRef.child(
			`${id}/${IMAGES}/${PRIMARY}`
		);
		const albumRef = collectionRef.child(`${id}/${IMAGES}/${ALBUM}`);
		const primaryRes = await primaryRef.listAll();
		const albumRes = await albumRef.listAll();

		if (primaryRes.items.length === 0) return;

		const albumImagePaths = !(albumRes.items.length === 0)
			? albumRes.items.map((item) => item.fullPath)
			: [];

		const imagePaths = {
			primary : primaryRes.items[0].fullPath,
			album   : albumImagePaths
		};

		console.log('listImagePathsFromFirebase - imagePaths', imagePaths);
		return imagePaths;
	} catch (err) {
		console.error('listImagePathsFromFirebase - err', err);
	}
};

/**
 *  downloadImageUrlsFromFirebase
 * 
 * Uses Firebase Storage .getDownloadURL() method to download
 * image url for a given storageRef and item id.
 * 
 * Takes a storage ref and item id to get the image urls that
 * can be used for an HTML image element source.
 * 
 * Returns an object {primary: 'imageUrl', album:['imageUrl,...']}
 */
const downloadImageUrlsFromFirebase = async (collectionRef, id) => {
	console.log('downloadImageUrlsFromFirebase', collectionRef, id);

	try {
		const imagePaths = await listImagePathsFromFirebase(
			collectionRef,
			id
		);

		console.log(
			'downloadImageUrlsFromFirebase - imagePaths',
			imagePaths
		);
		if (!imagePaths) return;

		const primaryImageUrl = await storageRef
			.child(`${imagePaths.primary}`)
			.getDownloadURL();

		let imageUrls = { primary: primaryImageUrl, album: [] };

		for await (let imagePath of imagePaths.album) {
			const imageUrl = await storageRef
				.child(`${imagePath}`)
				.getDownloadURL();

			imageUrls[ALBUM].push(imageUrl);
		}

		console.log('imageUrls', imageUrls);
		return imageUrls;
	} catch (err) {
		console.error('downloadImageUrlsFromFirebase err - ', err);
	}
};

const deleteImagesFromFirebase = async (collectionRef, id) => {
	console.log('deleteImagesFromFirebase', collectionRef, id);
	try {
		const imagePaths = await listImagePathsFromFirebase(
			collectionRef,
			id
		);
		console.log('deleteImagesFromFirebase - imagePaths', imagePaths);
		if (!imagePaths) return;

		storageRef.child(`${imagePaths.primary}`).delete();

		if (imagePaths.album.length > 0) {
			for (const imagePath of imagePaths.album) {
				console.log('imagePath', imagePath);

				storageRef.child(`${imagePath}`).delete();
			}
		}
	} catch (err) {
		console.log('deleteImagesFromFirebase -err', err);
	}
};

export {
	storageRef,
	treesRef,
	usersRef,
	groupsRef,
	uploadImagesToFirebase,
	downloadImageUrlsFromFirebase,
	listImagePathsFromFirebase,
	deleteImagesFromFirebase
};
