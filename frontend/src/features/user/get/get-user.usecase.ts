import { EMITTER_NAMES, EmittActions, emitter } from '../../../utils/emitter';

export const getUserUsecase = async () => {
	try {
		const response = await fetch('/api/get-user-info');
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
