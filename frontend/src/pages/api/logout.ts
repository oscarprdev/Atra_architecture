import { type APIRoute } from 'astro';
import { API_URL, TOKEN } from '../../constants';
import type { LoginUserBody } from './generated';

export const POST: APIRoute = async ctx => {
	try {
		const response = await fetch(`${API_URL}/auth/logout`, {
			method: 'POST',
		});

		const jsonResponse = await response.json();

		if (!jsonResponse.data) {
			throw new Error(jsonResponse);
		}

		ctx.cookies.delete(TOKEN);

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
