import { Env } from '..';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, OPTIONS, POST',
	'Access-Control-Allow-Headers': '*',
};

const corsMiddleware = (handler: (request: Request, env: Env) => Promise<Response>) => {
	return async (request: Request, env: Env): Promise<Response> => {
		const { body, status, headers } = await handler(request, env);

		const updatedResponse = new Response(body, {
			status,
			headers: {
				...headers,
				...corsHeaders,
			},
		});

		return updatedResponse;
	};
};

export default corsMiddleware;
