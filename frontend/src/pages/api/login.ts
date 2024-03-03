import { type APIRoute } from 'astro';
import { API_URL, TOKEN } from '../../constants';
import type { LoginUserBody } from './generated';

export const POST: APIRoute = async ctx => {
	try {
		const { email, password } = await ctx.request.json();

		const loginBody = {
			email,
			password,
		} satisfies LoginUserBody;

		const response = await fetch(`${API_URL}/auth/login`, {
			method: 'POST',
			body: JSON.stringify(loginBody),
		});

		const jsonResponse = await response.json();

		if (jsonResponse.status !== 201) {
			throw new Error(jsonResponse);
		}

		ctx.cookies.set(TOKEN, jsonResponse.data, {
			httpOnly: true,
			path: '/',
			maxAge: 60 * 60 * 2,
		});

		return new Response(
			JSON.stringify({
				message: jsonResponse.response,
			}),
			{
				status: 201,
			}
		);
	} catch (error: unknown) {
		return new Response(
			JSON.stringify({
				message: (error as { message: string }).message || 'Error',
			}),
			{
				status: 404,
			}
		);
	}
};
