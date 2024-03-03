import type { CreateProjectBody } from '../../../pages/api/generated';

const createFormData = (payload: CreateProjectBody) => {
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

export const createProjectUsecase = async (payload: CreateProjectBody) => {
	const formData = createFormData(payload);

	const response = await fetch('/api/create-project', {
		method: 'POST',
		body: formData,
	});

	if (response.status !== 201) {
		const jsonResponse = await response.json();

		throw new Error(jsonResponse.message);
	}
};

