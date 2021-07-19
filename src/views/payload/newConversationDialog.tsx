import React, { MouseEvent } from 'react';
import { Form, Formik, ErrorMessage } from 'formik';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
	errorMessage: {
		color: theme.palette.error.main,
		marginBottom: '1em',
	},
}));

const defaultConversation = {
	id: '',
	name: '',
};

export default function NewConversationDialog(props: { closeDialog: any }) {
	const { closeDialog } = props;
	const classes = useStyle();

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
			<DialogTitle id="form-dialog-title">Create Conversation</DialogTitle>
			<DialogContent>
				<DialogContentText>
					To subscribe to this website, please enter your email address here. We will send updates
					occasionally.
				</DialogContentText>
				<Formik
					initialValues={defaultConversation}
					onSubmit={(values) => {
						// createConversation(values.id, values.name);
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
