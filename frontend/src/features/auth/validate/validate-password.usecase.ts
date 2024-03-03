import type { ValidateUserPasswordBody } from '../../../pages/api/generated';
import { EMITTER_NAMES, EmittActions, emitter } from '../../../utils/emitter';

export const validatePasswordUsecase = async (input: ValidateUserPasswordBody) => {
	try {
		const response = await fetch('/api/validate-password', {
			method: 'POST',
			body: JSON.stringify(input),
		});
		const jsonResponse = await response.json();

		if (response.status !== 200) {
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
