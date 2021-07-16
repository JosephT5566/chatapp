import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs, { TabPanel } from '../../components/shared/Tabs';

const useStyle = makeStyles(() => ({
	sidebar: {
		width: '20rem',
		display: 'flex',
		flexDirection: 'column',
	},
}));

const TAB_LABELS = ['Conversation', 'Contact'];
const CONVERSATION_KEY = 0;
const CONTACT_KEY = 1;

export default function Sidebar(props: { id: string }) {
	const { id } = props;
	const classes = useStyle();
	const [tabIndex, setTabIndex] = useState(CONVERSATION_KEY);

	return (
		<div className={classes.sidebar}>
			<Tabs tabIndex={tabIndex} onTabIndexChange={setTabIndex} labels={TAB_LABELS} />
			<TabPanel index={CONVERSATION_KEY} value={tabIndex}>
				{'Conversation'}
			</TabPanel>
			<TabPanel index={CONTACT_KEY} value={tabIndex}>
				{'Contact'}
			</TabPanel>
		</div>
	);
}
