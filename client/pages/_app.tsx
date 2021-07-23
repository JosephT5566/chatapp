import '../styles/globals.css';
import React from 'react';
import { useActor } from '@xstate/react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../styles/theme';
import AuthServiceProvider, { useAuthServiceValue } from '../src/providers/AuthServiceProvider';
import { CredentialStore, AuthState } from '../src/machines/authMachine';
import { LOCALSTORAGE_KEY, PREFIX } from '../src/utils/static';

const AuthValueViewer = () => {
	const [state] = useActor(useAuthServiceValue().authService);
	console.log('STATE VALUE:', state.value);
	return null;
};

const credentialStore: CredentialStore = {
	loadAuthAsync: async () => {
		const prefixedKey = PREFIX + LOCALSTORAGE_KEY.AUTH_STATE;
		const value = localStorage.getItem(prefixedKey);

		if (!value) {
			throw new Error('authState in storage is invalid');
		}

		const authState = JSON.parse(value) as AuthState;
		return authState;
	},
	saveAuthAsync: async (value: AuthState) => {
		const prefixedKey = PREFIX + LOCALSTORAGE_KEY.AUTH_STATE;
		window.localStorage.setItem(prefixedKey, JSON.stringify(value));
	},
	clearAuthAsync: async () => {
		const prefixedKey = PREFIX + LOCALSTORAGE_KEY.AUTH_STATE;
		window.localStorage.removeItem(prefixedKey);
	},
};

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<React.Fragment>
			<AuthServiceProvider store={credentialStore}>
				<ThemeProvider theme={theme}>
					<AuthValueViewer />
					<Component {...pageProps} />
				</ThemeProvider>
			</AuthServiceProvider>
		</React.Fragment>
	);
}
export default MyApp;
