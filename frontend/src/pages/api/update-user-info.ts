import { type APIRoute } from 'astro';
import { API_URL, TOKEN } from '../../constants';

export const PUT: APIRoute = async ctx => {
	try {
		const payload = await ctx.request.formData();
		const token = ctx.cookies.get(TOKEN)?.value;

		const response = await fetch(`${API_URL}/user/update`, {
			method: 'PUT',
			body: payload,
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
				data: jsonResponse.data,
			}),
			{
				status: 201,
			}
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				message: (error as { message: string }).message || 'Error actualitzant usuari',
			}),
			{
				status: 404,
			}
		);
	}
};
