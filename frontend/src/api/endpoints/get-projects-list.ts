import type { Project } from '..';
import { API_URL } from '../../constants';
import { EMITTER_NAMES, EmittActions, emitter } from '../../utils/emitter';

export const getProjectList = async (page: number = 1, search?: string): Promise<Project[] | null> => {
	try {
		const url = new URL(`${API_URL}/project/list`);

		const params = new URLSearchParams({ page: page.toString() });

		if (search) {
			params.append('search', search);
		}

		url.search = params.toString();

		const response = await fetch(url.toString());
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
