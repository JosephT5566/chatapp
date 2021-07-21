import React from 'react';
import { Form, Formik, ErrorMessage } from 'formik';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import { useContacts } from '../../providers/ContactsProvider';

const useStyle = makeStyles((theme) => ({
	errorMessage: {
		color: theme.palette.error.main,
		marginBottom: '1em',
	},
}));

const defaultContact = {
	id: '',
	name: '',
};

export default function NewContactDialog(props: { closeDialog: any }) {
	const { closeDialog } = props;
	const classes = useStyle();
	const { createContact } = useContacts();

	const validate = (values: { id: string; name: string }) => {
		let isError = false;
		const errors = {
			id: '',
			name: '',
		};

		if (!values.id) {
			errors.id = `Can't be empty`;
			isError = true;
		}

		if (!values.name) {
			errors.name = `Can't be empty`;
			isError = true;
		}

		return isError ? errors : {};
	};

	return (
		<>
			<DialogTitle id="form-dialog-title">Create Contact</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Enter ID and user name to create a new contact.
				</DialogContentText>
				<Formik
					initialValues={defaultContact}
					onSubmit={(values) => {
						createContact(values.id, values.name);
						closeDialog();
					}}
					validate={validate}
				>
					{({ values, errors, handleChange }) => (
						<Form>
							<TextField
								autoFocus
								margin="dense"
								id="id"
								name="id"
								label="ID"
								value={values.id}
								onChange={handleChange}
								fullWidth
								required
								error={!!errors.id && errors.id !== ''}
							/>
							<ErrorMessage className={classes.errorMessage} component={'div'} name="id" />
							<TextField
								margin="dense"
								id="name"
								name="name"
								label="Name"
								value={values.name}
								onChange={handleChange}
								fullWidth
								required
								error={!!errors.name && errors.name !== ''}
							/>
							<ErrorMessage className={classes.errorMessage} component={'div'} name="name" />
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
