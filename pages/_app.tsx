import '../styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../styles/theme';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<React.Fragment>
			<ThemeProvider theme={theme}>
				<Component {...pageProps} />
			</ThemeProvider>
		</React.Fragment>
	);
}
export default MyApp;
