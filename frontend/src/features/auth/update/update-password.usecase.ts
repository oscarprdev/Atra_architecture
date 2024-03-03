import type { UpdateUserPasswordBody } from '../../../pages/api/generated';
import { EMITTER_NAMES, EmittActions, emitter } from '../../../utils/emitter';

export const updatePasswordUsecase = async (input: UpdateUserPasswordBody) => {
	try {
		const response = await fetch('/api/update-password', {
			method: 'PUT',
			body: JSON.stringify(input),
		});
		const jsonResponse = await response.json();

		if (response.status !== 201) {
			throw new Error(jsonResponse.message);
		}

		return response.status === 201;
	} catch (error) {
		emitter.emit(EMITTER_NAMES.error, {
			action: EmittActions.ERROR,
			message: error as string,
		});
	}
};
