import React from 'react';
import { Formik, Form } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyle = makeStyles((theme) => ({
	messageInput: {
		padding: '0.5rem',
	},
	outlinedInput_root: {
		width: '100%',
	},
}));

const defaultMessage = {
	text: '',
};

export default function MessageInput(props: { onSendMessage: (text: string) => void }) {
	const { onSendMessage: handleSend } = props;
	const classes = useStyle();

	const validate = (values: { text: string }) => {
		let isError = false;
		const errors = {
			text: '',
		};

		if (!values.text) {
			errors.text = `Can't be empty`;
			isError = true;
		}

		return isError ? errors : {};
	};

	return (
		<FormControl className={classes.messageInput}>
			<Formik
				initialValues={defaultMessage}
				onSubmit={(values, formikBag) => {
					handleSend(values.text);
					formikBag.resetForm();
				}}
				validate={validate}
			>
				{({ values, handleChange }) => (
					<Form>
						<OutlinedInput
							classes={{ root: classes.outlinedInput_root }}
							id="text"
							name="text"
							type={'text'}
							value={values.text}
							onChange={handleChange}
							autoFocus
							autoComplete="off"
							endAdornment={
								<InputAdornment position="end">
									<Button
										color={'primary'}
										variant={'contained'}
										aria-label="toggle password visibility"
										type="submit"
									>
										Send
									</Button>
								</InputAdornment>
							}
						/>
					</Form>
				)}
			</Formik>
		</FormControl>
	);
}
