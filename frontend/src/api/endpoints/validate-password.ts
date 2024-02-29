import type { ValidateUserPasswordBody } from '..';
import { API_URL } from '../../constants';
import { EMITTER_NAMES, EmittActions, emitter } from '../../utils/emitter';

export const validatePassword = async (input: ValidateUserPasswordBody) => {
	try {
		const jwt = localStorage.getItem('jwt');

		const response = await fetch(`${API_URL}/user/validate/password`, {
			method: 'POST',
			body: JSON.stringify({
				oldPassword: input.oldPassword,
			}),
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		});

		const jsonResponse = await response.json();

		if (jsonResponse.status !== 200) {
			throw new Error(jsonResponse);
		}

		return jsonResponse.data as boolean;
	} catch (error) {
		emitter.emit(EMITTER_NAMES.error, {
			action: EmittActions.ERROR,
			message: error as string,
		});
	}
};
