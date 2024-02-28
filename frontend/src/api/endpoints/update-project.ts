import { API_URL, IMAGE_URL } from '../../constants';
import { EMITTER_NAMES, EmittActions, emitter } from '../../utils/emitter';

export interface UpdateProjectPayload {
	id: string;
	title: string;
	description: string;
	year: number;
	isTop: boolean;
	mainImage: string | File;
	images: Array<string> | Array<File>;
}

const extractFilename = (imagekey: string) => {
	const parts = imagekey.split('-');
	const nonUuidParts = parts.splice(0, parts.length - 5);
	return nonUuidParts.length > 0 ? nonUuidParts.join('-') : imagekey;
};

const createFileFromImageUrl = async (imageKey: string) => {
	const filename = extractFilename(imageKey.split('/')[1]);

	const response = await fetch(`${IMAGE_URL}/${imageKey.replaceAll('/', '%2F')}`);

	const blob = await response.blob();

	return new File([blob], filename, { type: blob.type });
};

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

export const updateProject = async (project: UpdateProjectPayload) => {
	try {
		const formData = await createFormData(project);
		const jwt = localStorage.getItem('jwt');

		const response = await fetch(`${API_URL}/project/update`, {
			method: 'PUT',
			body: formData,
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		});

		const jsonResponse = await response.json();

		if (jsonResponse.status !== 201) {
			throw new Error(jsonResponse);
		}

		return jsonResponse.data;
	} catch (error) {
		emitter.emit(EMITTER_NAMES.error, {
			action: EmittActions.ERROR,
			message: error as string,
		});

		return null;
	}
};
