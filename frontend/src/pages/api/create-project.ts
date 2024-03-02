import { type APIRoute } from 'astro';
import { API_URL, TOKEN } from '../../constants';
import { EMITTER_NAMES, EmittActions, emitter } from '../../utils/emitter';
import type { CreateProjectBody } from './generated';

export const createFormData = (payload: CreateProjectBody) => {
	const formData = new FormData();

	if (payload.mainImage instanceof File) {
		formData.append('mainImage', payload.mainImage, payload.mainImage.name);
	}

	const rawImages = payload.images;
	if (Array.isArray(rawImages)) {
		rawImages.forEach(file => {
			if (file instanceof File) {
				formData.append('images', file, file.name);
			}
		});
	}

	formData.append('title', payload.title);
	formData.append('description', payload.description);
	formData.append('year', payload.year.toString());
	formData.append('isTop', payload.isTop.toString());

	return formData;
};

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

		return new Response(
			JSON.stringify({
				message: jsonResponse.response,
			}),
			{
				status: 201,
			}
		);
	} catch (error) {
		emitter.emit(EMITTER_NAMES.error, {
			action: EmittActions.ERROR,
			message: error as string,
		});

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
