import { type APIRoute } from 'astro';
import { API_URL } from '../../constants';

export const GET: APIRoute = async ctx => {
	try {
		const response = await fetch(`${API_URL}/user/describe`);
		const jsonResponse = await response.json();

		return new Response(
			JSON.stringify({
				message: jsonResponse.message,
				data: jsonResponse.data,
			}),
			{
				status: 201,
			}
		);
	} catch (error: unknown) {
		return new Response(
			JSON.stringify({
				message: (error as { message: string }).message || 'Error describint informacio de usuari',
			}),
			{
				status: 404,
			}
		);
	}
};
