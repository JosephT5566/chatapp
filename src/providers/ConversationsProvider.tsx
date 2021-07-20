import React, { useContext, createContext, ReactNode, useState } from 'react';
import useLocalStorage from '../hook/useLocalStorage';
import { useContacts } from './ContactsProvider';

class Recipient {
	id: string = '';
	name: string = '';
}

class Conversation {
	recipients: string[] = [''];
	name: string = '';
}

class FormattedConversation {
	recipients: Array<Recipient> = [new Recipient()];
	name: string = '';
	selected: boolean = false;
}

export class ConversationContent {
	conversations: Array<FormattedConversation> = [new FormattedConversation()];
	selectedConversation: FormattedConversation = new FormattedConversation();
	selectedConversationIndex: (index: number) => void = () => {};
	createConversation: (recipients: string[]) => void = () => {};
}

const ConversationsContext = createContext<ConversationContent>({
	conversations: [],
	selectedConversation: new FormattedConversation(),
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
		selectedConversation: formattedConversations[selectedConversationIndex],
		selectedConversationIndex: setSelectedConversationIndex,
		createConversation,
	};

	return <ConversationsContext.Provider value={value}>{children}</ConversationsContext.Provider>;
}
