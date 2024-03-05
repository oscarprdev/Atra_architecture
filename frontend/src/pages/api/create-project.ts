import { type APIRoute } from 'astro';
import { API_URL, TOKEN } from '../../constants';

export const POST: APIRoute = async ctx => {
	try {
		const payload = await ctx.request.formData();
		const jwt = ctx.cookies.get(TOKEN)?.value;

		const response = await fetch(`${API_URL}/project/create`, {
			method: 'POST',
			body: payload,
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		});

		const jsonResponse = await response.json();

		if (jsonResponse.status !== 201) {
			throw new Error(jsonResponse);
		}

		return new Response(
			JSON.stringify({
				message: jsonResponse.response,
			}),
			{
				status: 201,
			}
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				message: (error as { message: string }).message || 'Error creant projecte',
			}),
			{
				status: 404,
			}
		);
	}
};
