import { API_URL } from '../../constants';
import { EMITTER_NAMES, EmittActions, emitter } from '../../utils/emitter';

export const validateAuth = async (jwt: string) => {
	try {
		const response = await fetch(`${API_URL}/auth/validate`, {
			method: 'POST',
			body: JSON.stringify({
				jwt,
			}),
		});

		const jsonResponse = await response.json();

		if (jsonResponse.status !== 200) {
			throw new Error(jsonResponse);
		}

		return jsonResponse;
	} catch (error) {
		emitter.emit(EMITTER_NAMES.error, {
			action: EmittActions.ERROR,
			message: error as string,
		});
	}
};
