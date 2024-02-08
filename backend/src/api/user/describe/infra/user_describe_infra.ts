import { Client } from '@libsql/client/web';
import { Env } from '../../../..';
import { Bucket } from '../../../common/s3_bucket/bucket';
import buildLibsqlClient from '../../../../database';
import { UserDBResponse, UserInfraResponse } from '../../common/user_types';

async function describeUserInfra(env: Env): Promise<UserInfraResponse> {
	const client = buildLibsqlClient(env);
	const bucket = new Bucket(env.BUCKET, env.S3_API_URL, env.S3_ACCESS_KEY_ID, env.S3_SECRET_ACCESS_KEY);

	const userdb = await selectUser(client);
	const image = await bucket.getItemByKey(userdb.key_image);

	if (!image) {
		throw new Error(
			JSON.stringify({
				status: 500,
				message: 'Error providing image from bucket',
			})
		);
	}

	return {
		...userdb,
		image,
	};
}

async function selectUser(client: Client) {
	try {
		const userDb = await client.execute({
			sql: `SELECT * FROM users;`,
			args: [],
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
