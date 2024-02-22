import { Env } from '..';

const corsHeaders = {
	'Access-Control-Allow-Origin': 'http://localhost:4321',
	'Access-Control-Allow-Methods': 'GET, OPTIONS, POST, PUT, DELETE',
	'Access-Control-Allow-Headers': '*',
};

const corsMiddleware = (handler: (request: Request, env: Env) => Promise<Response>) => {
	return async (request: Request, env: Env): Promise<Response> => {
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: corsHeaders,
			});
		}

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
