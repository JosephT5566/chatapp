import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useContacts } from '../../providers/ContactsProvider';

export default function Contacts() {
	const { contacts } = useContacts();

	return (
		<div>
			<List component="nav" aria-label="secondary contacts folders">
				{contacts.map((contact) => (
					<ListItem button key={contact.id}>
						<ListItemText primary={contact.name} />
					</ListItem>
				))}
			</List>
		</div>
	);
}
