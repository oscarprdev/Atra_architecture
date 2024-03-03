import type { UpdateProjectIsTopBody } from '../../../pages/api/generated';
import { EMITTER_NAMES, EmittActions, emitter } from '../../../utils/emitter';

export const updateProjectIsTopUsecase = async (input: UpdateProjectIsTopBody) => {
	try {
		const response = await fetch('/api/update-project-is-top', {
			method: 'PUT',
			body: JSON.stringify(input),
		});

		const jsonResponse = await response.json();

		if (response.status !== 201) {
			throw new Error(jsonResponse);
		}

		return jsonResponse.status === 201;
	} catch (error) {
		emitter.emit(EMITTER_NAMES.error, {
			action: EmittActions.ERROR,
			message: error as string,
		});
	}
};
