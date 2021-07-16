import Head from 'next/head';
import Image from 'next/image';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import useLocalStorage from '../src/hook/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

import { APP_NAME } from '../src/utils/static';
import Sidebar from '../src/views/payload/sidebar';

const useStyle = makeStyles((theme) => ({
	home: {
		backgroundColor: theme.palette.background.default,
		width: '100%',
		height: '100vh',
	},
}));

export default function Home() {
	const [id, setId] = useLocalStorage('id', uuidv4());
	const classes = useStyle();

	return (
		<div className={classes.home}>
			<Head>
				<title>{APP_NAME}</title>
			</Head>

			<main>
				<Sidebar id={id}></Sidebar>
			</main>
		</div>
	);
}
