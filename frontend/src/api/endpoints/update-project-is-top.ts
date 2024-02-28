import { API_URL } from '../../constants';
import { EMITTER_NAMES, EmittActions, emitter } from '../../utils/emitter';

export const updateProjectIsTop = async (id: string, isTop: boolean) => {
	try {
		const jwt = localStorage.getItem('jwt');

		console.log(jwt, id, isTop);

		const response = await fetch(`${API_URL}/project/update/isTop`, {
			method: 'PUT',
			body: JSON.stringify({
				id,
				isTop,
			}),
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		});

		const jsonResponse = await response.json();

		if (jsonResponse.status !== 201) {
			throw new Error(jsonResponse);
		}

		return jsonResponse.data;
	} catch (error) {
		emitter.emit(EMITTER_NAMES.error, {
			action: EmittActions.ERROR,
			message: error as string,
		});

		return null;
	}
};
