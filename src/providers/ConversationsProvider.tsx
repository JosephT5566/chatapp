import React, { useContext, createContext, ReactNode, useState } from 'react';
import _ from 'lodash';
import useLocalStorage from '../hook/useLocalStorage';
import { useContacts } from './ContactsProvider';
import { isArrayEqual } from '../utils/helper';
import { LOCALSTORAGE_KEY } from '../utils/static';

class Recipient {
	id: string = '';
	name: string = '';
}

class Message {
	sender: string = '';
	senderName: string = '';
	text: string = '';
	fromMe: boolean = false;
}

class Conversation {
	recipients: string[] = [''];
	name: string = '';
	messages: Array<Message> = new Array<Message>();
}

class FormattedConversation {
	recipients: Array<Recipient> = new Array<Recipient>();
	messages: Array<Message> = new Array<Message>();
	selected: boolean = false;
	name: string = '';
}

export class ConversationContent {
	conversations: Array<FormattedConversation> = new Array<FormattedConversation>();
	selectedConversation: FormattedConversation = new FormattedConversation();
	setSelectedConversationIndex: (index: number) => void = () => {};
	sendMessage: (recipients: string[], text: string) => void = () => {};
	createConversation: (recipients: string[]) => void = () => {};
}

const ConversationsContext = createContext<ConversationContent>(new ConversationContent());

export const useConversations = () => useContext(ConversationsContext);

export function ConversationsProvider(props: { id: string; children: ReactNode }) {
	const { id, children } = props;
	const [conversations, setConversations] = useLocalStorage(LOCALSTORAGE_KEY.CONVERSATIONS, []);
	const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
	const { contacts } = useContacts();

	// recipients are the id of contacts
	const createConversation = (recipients: string[]) => {
		setConversations((prev: any) => [...prev, { recipients, messages: [] }]);
	};

	const addMessageToConversation = ({
		recipients,
		text,
		sender,
	}: {
		recipients: Array<string>;
		text: string;
		sender: string;
	}) => {
		setConversations((prevConversations: Array<Conversation>) => {
			let isConversationsChange = false;
			const newMessage = { sender, text };
			const newConversations = prevConversations.map((conversation) => {
				// check the new message is added to WHICH coversation
				if (isArrayEqual(conversation.recipients, recipients)) {
					isConversationsChange = true;
					return {
						...conversation,
						messages: [...conversation.messages, newMessage],
					};
				}

				return conversation;
			});

			// if the new message is NOT added to existing conversation, create a new conversation
			const updatedConversations = isConversationsChange
				? newConversations
				: [...prevConversations, { recipients, messages: [newMessage] }];

			return updatedConversations;
		});
	};

	const sendMessage = (recipients: Array<string>, text: string) => {
		addMessageToConversation({ recipients, text, sender: id });
	};

	const formattedConversations: Array<FormattedConversation> = conversations.map(
		(conversation: Conversation, index: number) => {
			const recipients = conversation.recipients.map((recipient) => {
				const contact = contacts.find((contact) => contact.id === recipient);
				const name = (contact && contact.name) || recipient;
				return { id: recipient, name };
			});

			const messages = conversation.messages.map((message) => {
				const contact = contacts.find((contact) => contact.id === message.sender);
				const name = (contact && contact.name) || message.sender;
				const fromMe = id === message.sender;
				return { ...message, senderName: name, fromMe };
			});

			const selected = index === selectedConversationIndex;

			return { ...conversation, messages, recipients, selected };
		}
	);

	const value: ConversationContent = {
		conversations: formattedConversations,
		selectedConversation: formattedConversations[selectedConversationIndex],
		setSelectedConversationIndex,
		sendMessage,
		createConversation,
	};

	return <ConversationsContext.Provider value={value}>{children}</ConversationsContext.Provider>;
}
