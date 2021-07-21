import React, { useContext, createContext, ReactNode } from 'react';
import useLocalStorage from '../hook/useLocalStorage';
import { LOCALSTORAGE_KEY } from '../utils/static';

type Contact = {
	id: string;
	name: string;
};

export type ContactContent = {
	contacts: Array<Contact>;
	createContact: (id: string, name: string) => void;
};

const ContactsContext = createContext<ContactContent>({
	contacts: [],
	createContact: () => {},
});

export const useContacts = () => {
	return useContext(ContactsContext);
};

export function ContactsProvider(props: { children: ReactNode }) {
	const { children } = props;
	const [contacts, setContacts] = useLocalStorage(LOCALSTORAGE_KEY.CONTACTS, new Array<Contact>());

	const createContact = (id: string, name: string) => {
		setContacts((prev) => [...prev, { id, name }]);
	};

	return <ContactsContext.Provider value={{ contacts, createContact }}>{children}</ContactsContext.Provider>;
}
