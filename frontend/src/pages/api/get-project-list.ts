import { type APIRoute } from 'astro';
import { API_URL } from '../../constants';

export const POST: APIRoute = async ctx => {
	try {
		const url = new URL(`${API_URL}/project/list`);
		const { page, search, date, year, isTop } = await ctx.request.json();

		const params = new URLSearchParams({ page: page.toString() });

		if (search) {
			params.append('search', search);
		}

		if (typeof date === 'boolean') {
			params.append('date', date.toString());
		}

		if (typeof year === 'boolean') {
			params.append('year', year.toString());
		}

		if (typeof isTop === 'boolean') {
			params.append('isTop', isTop.toString());
		}

		url.search = params.toString();

		const response = await fetch(url.toString());
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
				message: (error as { message: string }).message || 'Error listant projectes',
			}),
			{
				status: 404,
			}
		);
	}
};
