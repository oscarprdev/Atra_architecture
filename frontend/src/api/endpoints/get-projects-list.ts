import type { Project } from '..';
import { API_URL } from '../../constants';
import { EMITTER_NAMES, EmittActions, emitter } from '../../utils/emitter';

export const getProjectList = async (page: number = 1): Promise<Project[] | null> => {
	try {
		const response = await fetch(`${API_URL}/project/list?page=${page}`);
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
