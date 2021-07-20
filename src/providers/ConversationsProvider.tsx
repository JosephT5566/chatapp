import React, { useContext, createContext, ReactNode, useState } from 'react';
import useLocalStorage from '../hook/useLocalStorage';
import { useContacts } from './ContactsProvider';

type Recipient = {
	id: string;
	name: string;
};

type Conversation = {
	recipients: string[];
	name: string;
};

type FormattedConversation = {
	recipients: Array<Recipient>;
	name: string;
	selected: boolean;
};

export type ConversationContent = {
	conversations: Array<FormattedConversation>;
	selectedConversationIndex: (index: number) => void;
	createConversation: (recipients: string[]) => void;
};

const ConversationsContext = createContext<ConversationContent>({
	conversations: [],
	selectedConversationIndex: () => {},
	createConversation: () => {},
});

export const useConversations = () => useContext(ConversationsContext);

export function ConversationsProvider(props: { children: ReactNode }) {
	const { children } = props;
	const [conversations, setConversations] = useLocalStorage('conversations', []);
	const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
	const { contacts } = useContacts();

	// recipients are the id of contacts
	const createConversation = (recipients: string[]) => {
		setConversations((prev: any) => [...prev, { recipients, messages: [] }]);
	};

	const formattedConversations: Array<FormattedConversation> = conversations.map(
		(conversation: Conversation, index: number) => {
			const recipients = conversation.recipients.map((recipient) => {
				const contact = contacts.find((contact) => contact.id === recipient);
				const name = (contact && contact.name) || recipient;
				return { id: recipient, name };
			});
			const selected = index === selectedConversationIndex;
			return { ...conversation, recipients, selected };
		}
	);

	const value = {
		conversations: formattedConversations,
		createConversation,
		selectedConversationIndex: setSelectedConversationIndex,
	};

	return <ConversationsContext.Provider value={value}>{children}</ConversationsContext.Provider>;
}
