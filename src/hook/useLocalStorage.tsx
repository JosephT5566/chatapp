import React, { useState, useEffect } from 'react';
import { PREFIX } from '../utils/static';

// useLocalStorage can update the key/value to local storage
export default function useLocalStorage(key: string, initialValue?: any) {
	const prefixedKey = PREFIX + key;
	const [value, setValue] = useState(() => {
		const jsonValue = localStorage.getItem(prefixedKey);

		if (jsonValue != null) {
			return JSON.parse(jsonValue);
		}

		if (typeof initialValue === 'function') {
			return initialValue();
		} else {
			return initialValue;
		}
	});

	useEffect(() => {
		localStorage.setItem(prefixedKey, JSON.stringify(value));
	}, [prefixedKey, value]);

	return [value, setValue];
}
