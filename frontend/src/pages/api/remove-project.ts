import { type APIRoute } from 'astro';
import { API_URL, TOKEN } from '../../constants';

export const DELETE: APIRoute = async ctx => {
	try {
		const projectId = await ctx.request.json();
		const jwt = ctx.cookies.get(TOKEN)?.value;

		const response = await fetch(`${API_URL}/project/delete/${projectId}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		});
		const jsonResponse = await response.json();

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
				message: (error as { message: string }).message || 'Error eliminat projecte',
			}),
			{
				status: 404,
			}
		);
	}
};
