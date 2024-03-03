import { createFileFromImageUrl, extractFilename } from '../../../utils/files';

export interface UpdateProjectPayload {
	id: string;
	title: string;
	description: string;
	year: number;
	isTop: boolean;
	mainImage: string | File;
	images: string[] | File[];
}

const createFormData = async (payload: UpdateProjectPayload) => {
	const formData = new FormData();

	if (payload.mainImage instanceof File) {
		formData.append('mainImage', payload.mainImage, extractFilename(payload.mainImage.name));
	} else {
		const file = await createFileFromImageUrl(payload.mainImage);

		formData.append('mainImage', file, file.name);
	}

	const rawImages = payload.images;
	if (Array.isArray(rawImages)) {
		for (const image of rawImages) {
			if (image instanceof File) {
				formData.append('images', image, extractFilename(image.name));
			} else {
				const file = await createFileFromImageUrl(image);

				formData.append('images', file, file.name);
			}
		}
	}

	formData.append('title', payload.title);
	formData.append('description', payload.description);
	formData.append('year', payload.year.toString());
	formData.append('isTop', payload.isTop.toString());
	formData.append('id', payload.id);

	return formData;
};

export const updateProjectUsecase = async (payload: UpdateProjectPayload) => {
	const formData = await createFormData(payload);

	const response = await fetch('/api/update-project', {
		method: 'PUT',
		body: formData,
	});

	if (response.status !== 201) {
		const jsonResponse = await response.json();

		throw new Error(jsonResponse.message);
	}
};
