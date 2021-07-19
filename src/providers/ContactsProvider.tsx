import React, { useContext, createContext, ReactNode } from 'react';
import useLocalStorage from '../hook/useLocalStorage';

export type ContactContent = {
	contacts: [];
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
	const [contacts, setContacts] = useLocalStorage('contacts', []);

	const createContact = (id: string, name: string) => {
		setContacts((prev: any) => [...prev, { id, name }]);
	};

	return <ContactsContext.Provider value={{ contacts, createContact }}>{children}</ContactsContext.Provider>;
}