import { type APIRoute } from 'astro';
import { API_URL, TOKEN } from '../../constants';

export const PUT: APIRoute = async ctx => {
	try {
		const { id, isTop } = await ctx.request.json();
		const token = ctx.cookies.get(TOKEN)?.value;

		const response = await fetch(`${API_URL}/project/update/isTop`, {
			method: 'PUT',
			body: JSON.stringify({
				id,
				isTop,
			}),
			headers: {
				Authorization: `Bearer ${token}`,
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
				message: (error as { message: string }).message || 'Error actualitzant projecte destacat',
			}),
			{
				status: 404,
			}
		);
	}
};
