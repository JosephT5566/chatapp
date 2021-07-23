import React, { createContext, useContext, ReactChild } from 'react';
import { useInterpret } from '@xstate/react';
import { ActorRefFrom } from 'xstate';
import { authMachine, setStore, CredentialStore } from '../machines/authMachine';

export interface authServiceContextType {
	authService: ActorRefFrom<typeof authMachine>;
}

const authMachineContext = createContext<authServiceContextType>(
	// Typed this way to avoid TS errors,
	{} as authServiceContextType
);

export const useAuthServiceValue = () => {
	return useContext(authMachineContext);
};

export default function AuthServiceProvider(props: { store: CredentialStore; children: ReactChild }) {
	const { store, children } = props;
	const authService = useInterpret(authMachine);

	setStore(store);
	authService.send('LOAD_AUTH');

	return <authMachineContext.Provider value={{ authService }}>{children}</authMachineContext.Provider>;
}
