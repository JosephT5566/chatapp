import { createMachine, interpret, assign } from 'xstate';
import { useActor, useInterpret } from '@xstate/react';
import { User } from '../types/users';
import { toBase64 } from '../utils/encoding';
// import { API_ENDPOINT } from '../config'

export interface CredentialStore {
	loadAuthAsync: () => Promise<AuthState>;
	saveAuthAsync: (value: AuthState) => Promise<void>;
	clearAuthAsync: () => Promise<void>;
}

export interface AuthState {
	user: User;
	jwt: string;
	refreshToken: string;
}

interface Context {
	values?: AuthState;
	error?: Error;
}

type Event =
	| { type: 'LOAD_AUTH' }
	| { type: 'LOGIN'; account: string; password: string }
	| { type: 'SIGNUP_LOGIN'; auth: AuthState }
	| { type: 'LOGOUT' }
	| { type: 'REFRESH' };

type State =
	| {
			value: 'LOADING_STORED_AUTH';
			context: Context & {
				values: undefined;
				error: undefined;
			};
	  }
	| {
			value: 'REFRESHING';
			context: Context & {
				values: AuthState;
				error: undefined;
			};
	  }
	| {
			value: 'LOGGED_IN';
			context: Context & {
				values: AuthState;
				error: undefined;
			};
	  }
	| {
			value: 'LOGGED_OUT';
			context: Context & {
				values: undefined;
				error?: Error;
			};
	  }
	| {
			value: 'SIGNING_IN';
			context: Context & {
				values: undefined;
				error: undefined;
			};
	  };

// Initialize a stub store, allowing an explicit replacement
// by default, this will do nothing but throw when loading
var store: CredentialStore = {
	loadAuthAsync: async () => {
		throw new Error('stub storage has no values');
	},
	saveAuthAsync: async (_value: AuthState) => {},
	clearAuthAsync: async (): Promise<void> => {},
};

let signoutCallback: () => void = () => {};

const authMachine = createMachine<Context, Event, State>(
	{
		id: 'auth',
		initial: 'LOGGED_OUT',
		context: {
			values: undefined,
			error: undefined,
		},
		states: {
			LOADING_STORED_AUTH: {
				invoke: {
					id: 'loadAuth',
					src: () => loadStoredAuth(),
					onDone: [
						{
							cond: (_, event) => event.data === null,
							target: 'LOGGED_OUT',
						},
						{
							cond: (_, event) => event.data.shouldRefresh,
							target: 'REFRESHING',
							actions: assign((context, event) => ({
								...context,
								values: event.data,
							})),
						},
						{
							target: 'LOGGED_IN',
							actions: assign((context, event) => ({
								...context,
								values: event.data,
							})),
						},
					],
					onError: {
						target: 'LOGGED_OUT',
						actions: assign({
							error: (_, event) => event.data,
						}),
					},
				},
			},
			REFRESHING: {
				invoke: {
					id: 'refreshAuth',
					src: () => refreshJWT(),
					onDone: [
						{
							target: 'LOGGED_IN',
							actions: assign((context, event) => ({
								...context,
								values: event.data,
							})),
						},
					],
					onError: {
						target: 'LOGGED_OUT',
						// this is an explicit loggout so we need to clean state
						actions: assign({
							error: (_, event) => event.data,
						}),
					},
				},
			},
			LOGGED_IN: {
				on: {
					LOGOUT: {
						target: 'LOGGED_OUT',
						actions: 'CLEAR_AUTH_DATA',
					},
					REFRESH: {
						target: 'REFRESHING',
					},
				},
			},
			LOGGED_OUT: {
				on: {
					SIGNUP_LOGIN: {
						target: 'LOGGED_IN',
						actions: 'SAVE_AUTH_DATA',
					},

					LOGIN: 'SIGNING_IN',
					LOAD_AUTH: 'LOADING_STORED_AUTH',
				},
			},
			SIGNING_IN: {
				invoke: {
					id: 'signingIn',
					src: (_, event) => signIn(event),
					onDone: [
						{
							target: 'LOGGED_IN',
							actions: assign((context, event) => ({
								...context,
								values: event.data,
								error: undefined,
							})),
						},
					],
					onError: {
						target: 'LOGGED_OUT',
						actions: assign({
							error: (_, event) => event.data,
						}),
					},
				},
			},
		},
	},
	{
		actions: {
			SAVE_AUTH_DATA: assign((context, event) => {
				if (event.type !== 'SIGNUP_LOGIN') {
					return {
						...context,
						values: undefined,
						error: undefined,
					};
				}
				console.log('SAVE_AUTH_DATA event', event.auth);
				store.saveAuthAsync(event.auth);
				return {
					...context,
					values: event.auth,
					error: undefined,
				};
			}),
			CLEAR_AUTH_DATA: assign((context) => {
				store.clearAuthAsync();
				signoutCallback();
				return {
					...context,
					values: undefined,
					error: undefined,
				};
			}),
		},
	}
);

async function loadStoredAuth() {
	let authState = await store.loadAuthAsync();
	if (!authState) {
		return null;
	}
	//check if need to refresh
	let shouldRefresh = authState.refreshToken ? true : false;
	return { ...authState, shouldRefresh };
}

async function refreshJWT() {
	try {
		let auth = await store.loadAuthAsync();
		const resp = await fetch(`${API_ENDPOINT}/web/auth/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: auth.user.id,
				token: auth.refreshToken,
			}),
			credentials: 'include',
		});
		if (!resp.ok) {
			throw Error(`refresh failed: ${resp.status}`);
		}
		const authState: AuthState = await resp.json();
		authState.user.id = authState.user.id.toString();
		store.saveAuthAsync(authState);
		return authState;
	} catch (e) {
		throw Error(`refresh failed: ${e}`);
	}
}

async function signIn(event: Event) {
	console.log('EVENT', event);
	switch (event.type) {
		case 'LOGIN':
			const basic = createBasicAuth(event.account, event.password);
			const resp = await fetch(`${API_ENDPOINT}/web/auth/login`, {
				method: 'POST',
				headers: {
					Authorization: basic,
				},
				credentials: 'include',
			});
			if (!resp.ok) {
				throw Error('login failed');
			}
			// #HACK: Type casting only for compile-time, need to manually do it at runtime
			const authState: AuthState = await resp
				.json()
				.then((data) => {
					data.user.id = data.user.id.toString();
					return data as AuthState;
				})
				.catch((e) => {
					throw Error(`login failed: ${e.message}`);
				});
			store.saveAuthAsync(authState);
			return authState;
		default:
			throw Error('invalid event type for signIn');
	}
}

const createBasicAuth = (login: string, pwd: string): string => {
	return 'Basic ' + toBase64(`${login}:${pwd}`);
};

const getCurrentJwt = (): string | undefined => {
	return authService.state.context.values?.jwt;
};

const initStoreAndLoad = (newStore: CredentialStore) => {
	store = newStore;
	authService.send('LOAD_AUTH');
};

const setSignoutCallback = (cb: () => void) => {
	signoutCallback = cb;
};

const authService = useInterpret(authMachine);
export const useAuthServiceActor = () => useActor(authService);
export { getCurrentJwt, initStoreAndLoad, setSignoutCallback };
