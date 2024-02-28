import { API_URL } from '../../constants';
import { EMITTER_NAMES, EmittActions, emitter } from '../../utils/emitter';

export interface CreateProjectBody {
	title: string;
	description: string;
	year: number;
	isTop: boolean;
	mainImage: File;
	images: Array<File>;
}
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

export const createProject = async (payload: CreateProjectBody) => {
	try {
		const formData = createFormData(payload);
		const jwt = localStorage.getItem('jwt');

		const response = await fetch(`${API_URL}/project/create`, {
			method: 'POST',
			body: formData,
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		});

		const jsonResponse = await response.json();

		return jsonResponse.data;
	} catch (error) {
		emitter.emit(EMITTER_NAMES.error, {
			action: EmittActions.ERROR,
			message: error as string,
		});

		return null;
	}
};
