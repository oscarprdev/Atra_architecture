import type { User } from '..';
import { API_URL } from '../../constants';
import { EMITTER_NAMES, EmittActions, emitter } from '../../utils/emitter';
import { createFileFromImageUrl, extractFilename } from '../../utils/files';

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
	formData.append('direction', payload.description);
	formData.append('description', payload.description);
	formData.append('phone', payload.phone.toString());
	formData.append('id', payload.id);

	return formData;
};

export const updateUserInfo = async (input: UpdateInfoPayload): Promise<User | undefined> => {
	try {
		const formData = await createFormData(input);
		const jwt = localStorage.getItem('jwt');

		const response = await fetch(`${API_URL}/user/update`, {
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

		return jsonResponse.data as User;
	} catch (error) {
		emitter.emit(EMITTER_NAMES.error, {
			action: EmittActions.ERROR,
			message: error as string,
		});
	}
};
