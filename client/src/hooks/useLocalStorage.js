import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue = null) {
	const value = localStorage.getItem(key) || initialValue;

	const [ item, setItem ] = useState(value);

	useEffect(
		() => {
			if (!item) {
				localStorage.removeItem(key);
			}
			else {
				localStorage.setItem(key, item);
			}
		},
		[ key, item ]
	);

	return [ item, setItem ];
}

export default useLocalStorage;
