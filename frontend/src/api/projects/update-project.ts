import type { Project } from '..';
import { API_URL } from '../../constants';
import { EMITTER_NAMES, emitter } from '../../utils/emitter';

export const updateProject = async (project: Project) => {
	try {
		const formData = new FormData();

		Object.entries(project).forEach(([key, value]) => {
			if (typeof value !== 'string') {
				formData.append(key, JSON.stringify(value));
			} else {
				formData.append(key, value);
			}
		});

		formData.append('oldTitle', project.title);

		const response = await fetch(`${API_URL}/project/update`, {
			method: 'PUT',
			body: formData,
		});

		const jsonResponse = await response.json();

		return jsonResponse.data;
	} catch (error) {
		emitter.emit(EMITTER_NAMES.error, 'error.details');

		return null;
	}
};
