import { type APIRoute } from 'astro';
import { API_URL, TOKEN } from '../../constants';

export const POST: APIRoute = async ctx => {
	try {
		const { oldPassword } = await ctx.request.json();
		const token = ctx.cookies.get(TOKEN)?.value;

		const response = await fetch(`${API_URL}/user/validate/password`, {
			method: 'POST',
			body: JSON.stringify({
				oldPassword,
			}),
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const jsonResponse = await response.json();

		if (jsonResponse.status !== 200) {
			throw new Error(jsonResponse);
		}

		return new Response(
			JSON.stringify({
				message: jsonResponse.response,
				data: jsonResponse.data,
			}),
			{
				status: 200,
			}
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				message: (error as { message: string }).message || 'Error validant password',
			}),
			{
				status: 404,
			}
		);
	}
};
