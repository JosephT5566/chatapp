import React, { useContext, createContext, ReactNode } from 'react';
import useLocalStorage from '../hook/useLocalStorage';

export type ConversationContent = {
	conversations: [];
	createConversation: (id: string, name: string) => void;
};

const ConversationsContext = createContext<ConversationContent>({
	conversations: [],
	createConversation: () => {},
});

export const useConversations = () => useContext(ConversationsContext);

export function ConversationsProvider(props: { children: ReactNode }) {
	const { children } = props;
	const [conversations, setConversations] = useLocalStorage('conversations', []);

	const createConversation = (id: string, name: string) => {
		setConversations((prev: any) => [...prev, { id, name }]);
	};

	return (
		<ConversationsContext.Provider value={{ conversations, createConversation }}>
			{children}
		</ConversationsContext.Provider>
	);
}
