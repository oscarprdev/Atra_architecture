import { API_URL } from '../../constants';
import { EMITTER_NAMES, EmittActions, emitter } from '../../utils/emitter';

export const removeProject = async (projectId: string) => {
	try {
		const jwt = localStorage.getItem('jwt');

		const response = await fetch(`${API_URL}/project/delete/${projectId}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		});
		const jsonResponse = await response.json();

		return jsonResponse.data;
	} catch (error) {
		emitter.emit(EMITTER_NAMES.error, {
			action: EmittActions.ERROR,
			message: error as string,
		});

		return null;
	}
};
