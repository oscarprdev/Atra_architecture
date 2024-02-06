import { Client } from '@libsql/client/web';
import { Env } from '../../../..';
import buildLibsqlClient from '../../../../database';

async function userLoginInfra<I, R>(fn: (client: Client, input: I) => Promise<R>, env: Env, input: I) {
	const client = buildLibsqlClient(env);

	return fn(client, input);
}

export { userLoginInfra };
