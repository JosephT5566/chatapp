import React, { useState, useEffect } from 'react';
import { PREFIX } from '../utils/static';

// useLocalStorage can update the key/value to local storage
// TODO: add TS generics on hook
export default function useLocalStorage(key: string, initialValue?: any) {
	const prefixedKey = PREFIX + key;
	const [value, setValue] = useState(() => {
		// TODO: jsonValue will be 'null' in server side
		const jsonValue = typeof window !== 'undefined' ? localStorage.getItem(prefixedKey) : null;

		if (jsonValue) {
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
