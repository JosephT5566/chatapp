import React from 'react';
import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form, ErrorMessage } from 'formik';
import { APP_NAME } from '../src/utils/static';

const useStyle = makeStyles((theme) => ({
	login: {},
}));

export default function Login() {
	return (
		<div>
			<Head>
				<title>{`Login - ${APP_NAME}`}</title>
			</Head>
            
            <div>
                Login
            </div>
		</div>
	);
}
