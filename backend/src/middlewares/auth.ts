import { Env } from '..';
import { validateAuthUsecase } from '../api/user/graph';

export const authMiddleware = (handler: (request: Request, env: Env) => Promise<Response>) => {
	return async (request: Request, env: Env): Promise<Response> => {
		const headers = request.headers;

		const authHeader = headers.get('Authorization') || '';

		const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

		if (!token) {
			return new Response('Usuari no autoritzat', { status: 401 });
		}

		await validateAuthUsecase.validateAuth({ token: token, env });

		return await handler(request, env);
	};
};
