import { API_URL } from '../../constants';
import { EMITTER_NAMES, EmittActions, emitter } from '../../utils/emitter';

export interface UpdatePasswordInput {
	oldPassword: string;
	password: string;
}

export const updatePassword = async (input: UpdatePasswordInput) => {
	try {
		const jwt = localStorage.getItem('jwt');

		const response = await fetch(`${API_URL}/user/update/password`, {
			method: 'PUT',
			body: JSON.stringify({
				oldPassword: input.oldPassword,
				newPassword: input.password,
			}),
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		});

		const jsonResponse = await response.json();

		if (jsonResponse.status !== 201) {
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
