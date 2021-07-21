import React from 'react';
import MuiTab from '@material-ui/core/Tab';
import MuiTabs from '@material-ui/core/Tabs';

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

export function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && children}
		</div>
	);
}

export default function Tabs(props: { tabIndex: number; onTabIndexChange: any; labels: Array<string> }) {
	const { tabIndex, onTabIndexChange, labels } = props;

	const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
		event.preventDefault();

		onTabIndexChange(newValue);
	};

	return (
		<MuiTabs value={tabIndex} onChange={handleChangeTab} aria-label="simple tabs example">
			{labels.map((label, index) => (
				<MuiTab label={label} key={index} />
			))}
		</MuiTabs>
	);
}
