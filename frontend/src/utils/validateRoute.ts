import { validateAuth } from '../api/endpoints/validate-auth';

const LOCALSTORAGE_ITEM = 'jwt';

export const validateRoute = async () => {
	try {
		const jwt = localStorage.getItem(LOCALSTORAGE_ITEM);

		if (jwt) {
			const response = await validateAuth(jwt);

			jwt != response.data && window.location.replace('/auth');
		} else {
			window.location.replace('/auth');
		}
	} catch (error) {
		localStorage.removeItem(LOCALSTORAGE_ITEM);
		window.location.replace('/auth');
	}
};
