import type { Project } from '..';
import { API_URL } from '../../constants';
import { EMITTER_NAMES, emitter } from '../../utils/emitter';

export const getProjectList = async (): Promise<Project[] | null> => {
	try {
		const response = await fetch(`${API_URL}/project/list`);
		const jsonResponse = await response.json();

		return jsonResponse.data;
	} catch (error) {
		emitter.emit(EMITTER_NAMES.error, 'error.details');

		return null;
	}
};
