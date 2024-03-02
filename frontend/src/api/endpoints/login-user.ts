import { API_URL } from '../../constants';
import { EMITTER_NAMES, EmittActions, emitter } from '../../utils/emitter';

interface LoginUserPayload {
	email?: string;
	password?: string;
}

export const loginUser = async (payload: LoginUserPayload) => {
	try {
		const response = await fetch(`${API_URL}/auth/login`, {
			method: 'POST',
			body: JSON.stringify(payload),
		});

		const jsonResponse = await response.json();

		return jsonResponse;
	} catch (error) {
		throw new Error(error as string);
	}
};
