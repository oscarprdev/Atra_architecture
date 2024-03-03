import { EMITTER_NAMES, EmittActions, emitter } from '../../../utils/emitter';

export interface GetProjectListInput {
	page: number;
	search?: string;
	date?: boolean;
	year?: boolean;
	isTop?: boolean;
}

export const getProjectListUsecase = async (input: GetProjectListInput) => {
	try {
		const response = await fetch('/api/get-project-list', {
			method: 'POST',
			body: JSON.stringify(input),
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
