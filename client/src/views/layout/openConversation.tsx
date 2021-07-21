import React, { useEffect, useState, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useConversations } from '../../providers/ConversationsProvider';
import theme from '../../../styles/theme';

const useStyle = makeStyles(() => ({
	openConversation: {
		height: '100vh',
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
	},
	messageContainer: {
		flexGrow: 1,
		overflow: 'auto',
		display: 'flex',
		flexDirection: 'column-reverse',
	},
	messages: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'start',
		justifyContent: 'flex-end',
		padding: '0 0.3rem',
	},
	message: {
		margin: '0.3rem 0',
		display: 'flex',
		flexDirection: 'column',
		'&.fromMe': {
			alignSelf: 'flex-end',
		},

		'& .text': {
			borderRadius: '0.5rem',
			padding: '0.5rem 1rem',
			boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
			color: theme.palette.primary.main,
			'&.fromMe': {
				boxShadow: 'none',
				backgroundColor: theme.palette.primary.main,
				color: 'white',
			},
		},
		'& .sender': {
			color: theme.palette.grey[600],
			fontSize: 'small',
			marginTop: '0.2rem',
			'&.fromMe': {
				textAlign: 'right',
			},
		},
	},
	textInput: {
		padding: '0.5rem',
	},
}));

export default function OpenConversation() {
	const classes = useStyle();
	const [text, setText] = useState('');
	const { sendMessage, selectedConversation } = useConversations();
	const lastMessageRef = useRef<HTMLInputElement>(null);
	// const setRef = useCallback((node: React.RefObject<HTMLInputElement>) => {
	// 	console.log(node?.current);
	// 	node && node.current?.scrollIntoView();
	// }, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setText(e.target.value);
	};

	const handleSend = () => {
		sendMessage(
			selectedConversation.recipients.map((r) => r.id),
			text
		);
		setText('');
	};

	useEffect(() => {
		lastMessageRef.current && lastMessageRef.current.scrollIntoView();
	}, [selectedConversation?.messages]);

	return (
		<div className={classes.openConversation}>
			<div className={classes.messageContainer}>
				<div className={classes.messages}>
					{selectedConversation &&
						selectedConversation.messages.map((message, index) => {
							const isLastMessage = selectedConversation.messages.length - 1 === index;
							return (
								<div
									key={index}
									ref={isLastMessage ? lastMessageRef : null}
									className={`${classes.message} ${message.fromMe && 'fromMe'}`}
								>
									<div className={`text ${message.fromMe && 'fromMe'}`}>{message.text}</div>
									<div className={`sender ${message.fromMe && 'fromMe'}`}>
										{message.fromMe ? 'you' : message.senderName}
									</div>
								</div>
							);
						})}
				</div>
			</div>
			<FormControl className={classes.textInput}>
				<OutlinedInput
					id="standard-adornment-password"
					type={'text'}
					value={text}
					onChange={handleChange}
					autoFocus
					endAdornment={
						<InputAdornment position="end">
							<Button
								color={'primary'}
								variant={'contained'}
								aria-label="toggle password visibility"
								onClick={handleSend}
							>
								Send
							</Button>
						</InputAdornment>
					}
				/>
			</FormControl>
		</div>
	);
}
