import { API_URL } from '../../constants';

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
		localStorage.removeItem('jwt');
	}
};
