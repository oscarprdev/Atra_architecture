import { defineMiddleware } from 'astro/middleware';
import { API_URL, TOKEN } from '../constants';

export const PRIVATE_ROUTES = [
	'/auth/dashboard',
	'/auth/dashboard/account',
	'/auth/dashboard/info',
	'/auth/dashboard/user',
];

export const onRequest = defineMiddleware(async (context, next) => {
	if (PRIVATE_ROUTES.includes(context.url.pathname)) {
		const token = context.cookies.get(TOKEN)?.value ?? '';

		const response = await fetch(`${API_URL}/auth/validate`, {
			method: 'POST',
			body: JSON.stringify({ jwt: token }),
		});

		const jsonResponse = await response.json();

		if (jsonResponse.status !== 200) {
			return Response.redirect(new URL('/', context.url));
		}

		return next();
	}

	return next();
});
