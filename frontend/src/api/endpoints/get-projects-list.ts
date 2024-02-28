import type { Project } from '..';
import { API_URL } from '../../constants';
import { EMITTER_NAMES, EmittActions, emitter } from '../../utils/emitter';

export interface GetProjectListInput {
	page: number;
	search?: string;
	date?: boolean;
	year?: boolean;
	isTop?: boolean;
}

export const getProjectList = async ({
	page,
	search,
	date,
	year,
	isTop,
}: GetProjectListInput): Promise<Project[] | null> => {
	try {
		const url = new URL(`${API_URL}/project/list`);

		const params = new URLSearchParams({ page: page.toString() });

		if (search) {
			params.append('search', search);
		}

		if (typeof date === 'boolean') {
			params.append('date', date.toString());
		}

		if (typeof year === 'boolean') {
			params.append('year', year.toString());
		}

		if (typeof isTop === 'boolean') {
			params.append('isTop', isTop.toString());
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
