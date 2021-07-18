import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import Tabs, { TabPanel } from '../../components/shared/Tabs';
import Conversations from './conversations';
import Contacts from './contacts';

const useStyle = makeStyles(() => ({
	sidebar: {
		width: '20rem',
		height: '100vh',
		display: 'flex',
		flexDirection: 'column',
	},
	tabContainer: {
		flexGrow: 1,
	},
	myId: {
		padding: '0.5rem',
	},
}));

const TAB_LABELS = ['Conversation', 'Contact'];
const CONVERSATION_KEY = 0;
const CONTACT_KEY = 1;

export default function Sidebar(props: { id: string }) {
	const { id } = props;
	const classes = useStyle();
	const [activeKey, setActiveKey] = useState(CONVERSATION_KEY);
	const [openDialog, setOpenDialog] = useState(false);
	const isConversation = activeKey === CONVERSATION_KEY;

	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	return (
		<div className={classes.sidebar}>
			<div className={classes.tabContainer}>
				<Tabs tabIndex={activeKey} onTabIndexChange={setActiveKey} labels={TAB_LABELS} />
				<TabPanel index={CONVERSATION_KEY} value={activeKey}>
					<Conversations />
				</TabPanel>
				<TabPanel index={CONTACT_KEY} value={activeKey}>
					<Contacts />
				</TabPanel>
			</div>
			<div className={classes.myId}>
				Your Id: <span>{id}</span>
			</div>
			<Button onClick={handleOpenDialog}>New {isConversation ? 'Conversation' : 'Contact'}</Button>
			<Dialog open={openDialog} onClose={handleCloseDialog}>
				<div>123</div>
			</Dialog>
		</div>
	);
}
