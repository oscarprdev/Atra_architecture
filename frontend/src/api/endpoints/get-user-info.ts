import { API_URL } from '../../constants';
import { EMITTER_NAMES, EmittActions, emitter } from '../../utils/emitter';

export const getUserInfo = async () => {
	try {
		const response = await fetch(`${API_URL}/user/describe`);
		const jsonResponse = await response.json();

		return jsonResponse.data;
	} catch (error) {
		emitter.emit(EMITTER_NAMES.error, {
			action: EmittActions.ERROR,
			message: error as string,
		});
	}
};
