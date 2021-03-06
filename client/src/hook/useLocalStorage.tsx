import React, { useState, useEffect } from 'react';
import { PREFIX } from '../utils/static';

// useLocalStorage can update the key/value to local storage
export default function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
	const prefixedKey = PREFIX + key;
	const [value, setValue] = useState<T>(() => {
		// TODO: jsonValue will be 'null' in server side
		const jsonValue = typeof window !== 'undefined' ? localStorage.getItem(prefixedKey) : null;

		if (jsonValue) {
			return JSON.parse(jsonValue) as T;
		}

		return initialValue;
	});

	useEffect(() => {
		localStorage.setItem(prefixedKey, JSON.stringify(value));
	}, [prefixedKey, value]);

	return [value, setValue];
}
