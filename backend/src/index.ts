import { createClient, Client as LibsqlClient } from '@libsql/client/web';
import { Router, RouterType } from 'itty-router';
import { Bucket } from './bucket';

export interface Env {
	LIBSQL_DB_URL?: string;
	LIBSQL_DB_AUTH_TOKEN?: string;
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

		return env.router.handle(request);
	},
};

function buildLibsqlClient(env: Env): LibsqlClient {
	const url = env.LIBSQL_DB_URL?.trim();
	if (url === undefined) {
		throw new Error('LIBSQL_DB_URL env var is not defined');
	}

	const authToken = env.LIBSQL_DB_AUTH_TOKEN?.trim();
	if (authToken === undefined) {
		throw new Error('LIBSQL_DB_AUTH_TOKEN env var is not defined');
	}

	return createClient({ url, authToken });
}

function buildRouter(env: Env): RouterType {
	const router = Router();

	const bucket = new Bucket(env.BUCKET, env.S3_API_URL, env.S3_ACCESS_KEY_ID, env.S3_SECRET_ACCESS_KEY);

	router.post('/upload', async (request) => {
		const formData = await request.formData();
		const file = formData.get('image') as File;

		if (file == null) {
			return new Response('Error uploading file', { status: 400 });
		}

		const arrayBuffer = await file.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);

		await bucket.uploadFile(uint8Array, `benicalaf/${file.name}`, file.type);

		return new Response('File successfully uploaded', { status: 201 });
	});

	router.get('/project/:project', async (request) => {
		const { project } = request.params;

		const response = await bucket.getItemsByEntity(project);
		console.log(response);
		return Response.json('success');
	});

	router.get('/users', async () => {
		const client = buildLibsqlClient(env);
		const rs = await client.execute('select * from example_users');
		return Response.json(rs);
	});

	router.get('/add-user', async (request) => {
		const client = buildLibsqlClient(env);
		const email = request.query.email;
		if (email === undefined) {
			return new Response('Missing email', { status: 400 });
		}
		if (typeof email !== 'string') {
			return new Response('email must be a single string', { status: 400 });
		}
		if (email.length === 0) {
			return new Response('email length must be > 0', { status: 400 });
		}

		try {
			await client.execute({
				sql: 'insert into example_users values (?)',
				args: [email],
			});
		} catch (e) {
			console.error(e);
			return new Response('database insert failed');
		}

		return new Response('Added');
	});

	router.all('*', () => new Response(`${env.LIBSQL_DB_URL}`, { status: 404 }));

	return router;
}
