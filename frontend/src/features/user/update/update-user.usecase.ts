import { EMITTER_NAMES, EmittActions, emitter } from '../../../utils/emitter';
import { createFileFromImageUrl, extractFilename } from '../../../utils/files';

export interface UpdateInfoPayload {
	id: string;
	email: string;
	name: string;
	direction: string;
	description: string;
	phone: number;
	image: File | string;
}

const createFormData = async (payload: UpdateInfoPayload) => {
	const formData = new FormData();

	if (payload.image instanceof File) {
		formData.append('image', payload.image, extractFilename(payload.image.name));
	} else {
		const file = await createFileFromImageUrl(payload.image);

		formData.append('image', file, file.name);
	}

	formData.append('email', payload.email);
	formData.append('name', payload.name);
	formData.append('direction', payload.direction);
	formData.append('description', payload.description);
	formData.append('phone', payload.phone.toString());
	formData.append('id', payload.id);

	return formData;
};

export const updateUserUsecase = async (input: UpdateInfoPayload) => {
	try {
		const formData = await createFormData(input);

		const response = await fetch('/api/update-user-info', {
			method: 'PUT',
			body: formData,
		});

		const jsonResponse = await response.json();

		if (response.status !== 201) {
			throw new Error(jsonResponse.message);
		}

		return jsonResponse.data;
	} catch (error) {
		emitter.emit(EMITTER_NAMES.error, {
			action: EmittActions.ERROR,
			message: error as string,
		});
	}
};
