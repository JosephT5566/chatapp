import { useEffect } from 'react';
import { NextComponentType } from 'next';
import { useActor } from '@xstate/react';
import { useAuthServiceValue } from '../providers/AuthServiceProvider';
import Router, { useRouter } from 'next/router';

const getRedirectTo = (): Location => {
	if (typeof window !== 'undefined' && window.location) {
		return window.location;
	}
	return {} as Location;
};

export const withAuth = (WrappedComponent: NextComponentType) => {
	const Wrapper = () => {
		const [state] = useActor(useAuthServiceValue().authService);
		const router = useRouter();

		useEffect(() => {
			// The loading state:
			// (['LOADING_STORED_AUTH', 'LOGGED_IN.REFRESH'].some(auth.matches))
			const redir = getRedirectTo();

			if (state.matches('LOGGED_OUT')) {
				router.replace({
					pathname: '/login',
					query: { redirect: router.asPath },
				});
				// Router.replace(`/login?redirect=${redir.pathname + encodeURIComponent(redir.search)}`, undefined, {
				// 	shallow: true,
				// });
			}
		}, [state]);

		return <WrappedComponent />;
	};

	return Wrapper;
};
