import Head from 'next/head';
import Image from 'next/image';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import useLocalStorage from '../src/hook/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

import { APP_NAME } from '../src/utils/static';
import Sidebar from '../src/views/layout/sidebar';
import { ConversationsProvider, useConversations } from '../src/providers/ConversationsProvider';
import { ContactsProvider } from '../src/providers/ContactsProvider';
import OpenConversation from '../src/views/layout/openConversation';

const useStyle = makeStyles((theme) => ({
	home: {
		backgroundColor: theme.palette.background.default,
		width: '100%',
		height: '100vh',
	},
	content: {
		display: 'flex',
	},
}));

export default function Home() {
	const [id, setId] = useLocalStorage('id', uuidv4());
	const classes = useStyle();
	const { selectedConversation } = useConversations();

	return (
		<div className={classes.home}>
			<Head>
				<title>{APP_NAME}</title>
			</Head>

			<main className={classes.content}>
				<ContactsProvider>
					<ConversationsProvider id={id}>
						<Sidebar id={id}></Sidebar>
						{selectedConversation && <OpenConversation />}
					</ConversationsProvider>
				</ContactsProvider>
			</main>
		</div>
	);
}
