import buildRouter from './router/router';
import { RouterType } from 'itty-router';

export interface Env {
	LIBSQL_DB_URL?: string;
	LIBSQL_DB_AUTH_TOKEN?: string;
	SALT: string;
	BUCKET: string;
	S3_API_URL: string;
	S3_ACCESS_KEY_ID: string;
	S3_SECRET_ACCESS_KEY: string;
	router?: RouterType;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (env.router === undefined) {
			env.router = buildRouter(env);
		}

		return env.router.handle(request, env);
	},
};
