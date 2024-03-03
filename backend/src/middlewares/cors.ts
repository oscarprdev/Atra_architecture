import { Env } from '..';

const corsHeaders = {
	'Access-Control-Allow-Origin': 'http://localhost:4321',
	'Access-Control-Allow-Methods': 'GET, OPTIONS, POST, PUT, DELETE',
	'Access-Control-Allow-Headers': '*',
};
const allowedOrigins = ['http://localhost:4321', 'https://atra-architectura.vercel.app'];

const corsMiddleware = (handler: (request: Request, env: Env) => Promise<Response>) => {
	return async (request: Request, env: Env): Promise<Response> => {
		const origin = request.headers.get('Origin');

		const headers = { ...corsHeaders };
		if (origin && allowedOrigins.includes(origin)) {
			headers['Access-Control-Allow-Origin'] = origin;
		}

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers,
			});
		}

		const { body, status, headers: responseHeaders } = await handler(request, env);

		const updatedResponse = new Response(body, {
			status,
			headers: {
				...responseHeaders,
				...headers,
			},
		});

		return updatedResponse;
	};
};

export { corsMiddleware, corsHeaders };
