import { API_URL } from '../../constants';
import { EMITTER_NAMES, emitter } from '../../utils/emitter';

export const removeProject = async (projectId: string) => {
	try {
		const response = await fetch(`${API_URL}/project/delete/${projectId}`, {
			method: 'DELETE',
		});
		const jsonResponse = await response.json();

		return jsonResponse.data;
	} catch (error) {
		emitter.emit(EMITTER_NAMES.error, 'error.details');

		return null;
	}
};
