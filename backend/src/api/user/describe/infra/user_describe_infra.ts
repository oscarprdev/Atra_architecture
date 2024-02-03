import { Client } from '@libsql/client/web';
import { Env } from '../../../..';
import { Bucket } from '../../../../bucket';
import buildLibsqlClient from '../../../../database';
import { UserDBResponse } from '../../upload/infra/infra.types';

async function describeUserInfra(userId: string, env: Env) {
	const client = buildLibsqlClient(env);
	const bucket = new Bucket(env.BUCKET, env.S3_API_URL, env.S3_ACCESS_KEY_ID, env.S3_SECRET_ACCESS_KEY);

	const userdb = await selectUser(userId, client);
	const image = await bucket.getItemByKey(userdb.key_image);

	return {
		...userdb,
		image,
	};
}

async function selectUser(userId: string, client: Client) {
	try {
		const userDb = await client.execute({
			sql: `SELECT * FROM users WHERE user_id = ?;`,
			args: [userId],
		});

		return userDb.rows[0] as unknown as UserDBResponse;
	} catch (error) {
		throw new Error(
			JSON.stringify({
				status: 500,
				message: `Error SQL: ${error instanceof Error ? error.message : 'Error selecting user from DB'}`,
			})
		);
	}
}

export default describeUserInfra;
