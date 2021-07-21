import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useConversations } from '../../providers/ConversationsProvider';

export default function Conversations() {
	const { conversations, setSelectedConversationIndex } = useConversations();

	return (
		<div>
			<List component="nav" aria-label="secondary conversations folders">
				{conversations.map((conversation, index) => (
					<ListItem
						button
						key={index}
						selected={conversation.selected}
						onClick={() => {
							setSelectedConversationIndex(index);
						}}
					>
						<ListItemText primary={conversation.recipients.map((r) => r.name).join(', ')} />
					</ListItem>
				))}
			</List>
		</div>
	);
}
