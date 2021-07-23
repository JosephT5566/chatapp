import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { useActor } from '@xstate/react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Formik, Form, ErrorMessage } from 'formik';
import { v4 as uuidv4 } from 'uuid';

import { APP_NAME } from '../src/utils/static';
import { useAuthServiceValue } from '../src/providers/AuthServiceProvider';

const useStyle = makeStyles((theme) => ({
	login: {
		backgroundColor: theme.palette.background.default,
		width: '100%',
		height: '100vh',
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	input: {
		margin: '1rem 2rem',
	},
	button: {
		width: '10rem',
		margin: '0.2rem',
	},
	errorMessage: {
		color: theme.palette.error.main,
		width: '100%',
		marginBottom: '1em',
	},
}));

class LoginValues {
	username: string = '';
	id: string = '';
}

export default function Login() {
	const classes = useStyle();
	const router = useRouter();
	const [_, send] = useActor(useAuthServiceValue().authService);

	const redirect = router.query.redirect
		? Array.isArray(router.query.redirect)
			? router.query.redirect[0]
			: router.query.redirect
		: '/';

	const validate = (values: LoginValues) => {
		let isError = false;
		const errors: LoginValues = {
			id: '',
			username: '',
		};

		if (!values.id) {
			errors.id = `Can't be empty`;
			isError = true;
		}

		// if (!values.username) {
		// 	errors.username = `Can't be empty`;
		// 	isError = true;
		// }

		return isError ? errors : {};
	};

	const handleGenId = () => {};

	return (
		<div className={classes.login}>
			<Head>
				<title>{`Login - ${APP_NAME}`}</title>
			</Head>

			<Container>
				<Typography variant={'h1'}>Login</Typography>
				<div>{redirect}</div>
				<Formik
					initialValues={new LoginValues()}
					onSubmit={(values) => {
						send({
							type: 'LOGIN',
							id: values.id,
							username: '',
						});
						router.push(redirect);
					}}
					validate={validate}
				>
					{({ values, errors, handleChange, setValues }) => (
						<Form className={classes.form}>
							<TextField
								id={'username'}
								name={'username'}
								value={values.username}
								label={'Username'}
								variant={'outlined'}
								className={classes.input}
								onChange={handleChange}
								fullWidth
								autoFocus
								autoComplete={'off'}
								error={!!errors.username && errors.username !== ''}
							/>
							<ErrorMessage className={classes.errorMessage} component={'div'} name="username" />
							<TextField
								id={'id'}
								name={'id'}
								value={values.id}
								label={'ID'}
								variant={'outlined'}
								className={classes.input}
								onChange={handleChange}
								fullWidth
								autoComplete={'off'}
								classes={{}}
								error={!!errors.id && errors.id !== ''}
							/>
							<ErrorMessage className={classes.errorMessage} component={'div'} name="id" />
							<Button variant={'contained'} type={'submit'} className={classes.button}>
								Login
							</Button>
							<Button
								variant={'contained'}
								className={classes.button}
								onClick={() => {
									setValues((prev) => ({ ...prev, id: uuidv4() }));
								}}
							>
								Generate ID
							</Button>
						</Form>
					)}
				</Formik>
			</Container>
		</div>
	);
}
