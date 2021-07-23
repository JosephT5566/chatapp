import Head from 'next/head';
import Image from 'next/image';
import { makeStyles } from '@material-ui/core';
import { useActor } from '@xstate/react';

import { APP_NAME } from '../src/utils/static';
import Sidebar from '../src/views/layout/sidebar';
import { ConversationsProvider, useConversations } from '../src/providers/ConversationsProvider';
import { ContactsProvider } from '../src/providers/ContactsProvider';
import OpenConversation from '../src/views/layout/openConversation';
import SocketProvider from '../src/providers/SocketProvider';
import { useAuthServiceValue } from '../src/providers/AuthServiceProvider';
import { withAuth } from '../src/hocs/withAuth';

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

function Home() {
	const classes = useStyle();
	const { selectedConversation } = useConversations();
	const [state] = useActor(useAuthServiceValue().authService);
	const id = state.context.values?.user.id as string;

	return (
		<div className={classes.home}>
			<Head>
				<title>{APP_NAME}</title>
			</Head>

			<main className={classes.content}>
				<SocketProvider id={id}>
					<ContactsProvider>
						<ConversationsProvider id={id}>
							<Sidebar id={id}></Sidebar>
							{selectedConversation && <OpenConversation />}
						</ConversationsProvider>
					</ContactsProvider>
				</SocketProvider>
			</main>
		</div>
	);
}

export default withAuth(Home);
