import type { Project } from '..';
import { API_URL } from '../../constants';
import { EMITTER_NAMES, emitter } from '../../utils/emitter';

const createFormData = (payload: Project) => {
	const formData = new FormData();

	if (payload.mainImage instanceof File) {
		formData.append('mainImage', payload.mainImage, payload.mainImage.name);
	} else {
		formData.append('mainImage', JSON.stringify(payload.mainImage));
	}

	const rawImages = payload.images;
	if (Array.isArray(rawImages)) {
		rawImages.forEach(file => {
			if (file instanceof File) {
				formData.append('images', file, file.name);
			} else {
				formData.append('images', JSON.stringify(file));
			}
		});
	}

	formData.append('title', payload.title);
	formData.append('description', payload.description);
	formData.append('year', payload.year.toString());
	formData.append('isTop', payload.isTop.toString());
	formData.append('id', payload.id);
	formData.append('oldTitle', payload.title);

	return formData;
};

export const updateProject = async (project: Project) => {
	try {
		const formData = createFormData(project);

		const response = await fetch(`${API_URL}/project/update`, {
			method: 'PUT',
			body: formData,
		});

		const jsonResponse = await response.json();

		if (jsonResponse.status !== 201) {
			throw new Error(jsonResponse);
		}

		return jsonResponse.data;
	} catch (error) {
		emitter.emit(EMITTER_NAMES.error, 'error.details');

		return null;
	}
};
