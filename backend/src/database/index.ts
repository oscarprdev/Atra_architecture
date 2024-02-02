import { createClient, Client as LibsqlClient } from '@libsql/client/web';
import { Env } from '..';

function buildLibsqlClient(env: Env): LibsqlClient {
	const url = env.LIBSQL_DB_URL?.trim();
	if (url === undefined) {
		throw new Error(JSON.stringify({ status: 500, message: 'LIBSQL_DB_URL env var is not defined' }));
	}

	const authToken = env.LIBSQL_DB_AUTH_TOKEN?.trim();
	if (authToken === undefined) {
		throw new Error(JSON.stringify({ status: 500, message: 'LIBSQL_DB_AUTH_TOKEN env var is not defined' }));
	}

	return createClient({ url, authToken });
}

export default buildLibsqlClient;
