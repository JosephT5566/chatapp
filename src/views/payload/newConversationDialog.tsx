import React from 'react';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core';
import { useConversations } from '../../providers/ConversationsProvider';
import { useContacts } from '../../providers/ContactsProvider';

const useStyle = makeStyles((theme) => ({
	errorMessage: {
		color: theme.palette.error.main,
		marginBottom: '1em',
	},
	checkboxes: {
		display: 'flex',
		flexDirection: 'column',
		padding: '1rem',
	},
}));

const defaultConversation = {
	selectedContactIds: [],
	name: '',
};

export default function NewConversationDialog(props: { closeDialog: any }) {
	const { closeDialog } = props;
	const classes = useStyle();
	const { createConversation } = useConversations();
	const { contacts } = useContacts();

	const validate = (values: { name: string; selectedContactIds: string[] }) => {
		let isError = false;
		const errors = {
			name: '',
			selectedContactIds: '',
		};

		if (values.selectedContactIds.length === 0) {
			errors.selectedContactIds = `Must select one contact at least`;
			isError = true;
		}

		return isError ? errors : {};
	};

	return (
		<>
			<DialogTitle id="form-dialog-title">Create Conversation</DialogTitle>
			<DialogContent>
				<DialogContentText>Selecting contacts to create a new conversation.</DialogContentText>
				<Formik
					initialValues={defaultConversation}
					onSubmit={(values) => {
						createConversation(values.selectedContactIds);
						closeDialog();
					}}
					validate={validate}
				>
					{({ values, errors, handleChange }) => (
						<Form>
							<TextField
								margin="dense"
								id="name"
								name="name"
								label="Conversation Name"
								value={values.name}
								onChange={handleChange}
								fullWidth
								error={!!errors.name && errors.name !== ''}
							/>
							<ErrorMessage className={classes.errorMessage} component={'div'} name="name" />
							<div className={classes.checkboxes}>
								{contacts.map((contact) => (
									<FormControlLabel
										control={<Field type="checkbox" name="selectedContactIds" value={contact.id} />}
										label={contact.name}
									/>
								))}
							</div>
							<ErrorMessage
								className={classes.errorMessage}
								component={'div'}
								name="selectedContactIds"
							/>
							<DialogActions>
								<Button onClick={closeDialog} color="primary">
									Cancel
								</Button>
								<Button type="submit" color="primary">
									Submit
								</Button>
							</DialogActions>
						</Form>
					)}
				</Formik>
			</DialogContent>
		</>
	);
}
