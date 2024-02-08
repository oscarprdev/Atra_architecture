import { Client } from '@libsql/client/web';
import { Env } from '../../../..';
import buildLibsqlClient from '../../../../database';
import { UserUpdateInput } from '../user_update_types';
import { Bucket } from '../../../common/s3_bucket/bucket';
import uploadImageToBucket from '../../../project/common/upload_image';
import { UpdateUserIntoDbInput } from './infra.types';
import { UserDBResponse, UserInfraResponse } from '../../common/user_types';

async function updateUserInfra(input: UserUpdateInput, env: Env): Promise<UserInfraResponse> {
	const client = buildLibsqlClient(env);
	const bucket = new Bucket(env.BUCKET, env.S3_API_URL, env.S3_ACCESS_KEY_ID, env.S3_SECRET_ACCESS_KEY);

	const currentUser = await selectCurrentUserFromDB(client);

	const [_, imageUploaded] = await Promise.all([
		bucket.deleteItemByKey(currentUser.key_image),
		uploadImageToBucket(input.image, 'personal', env),
	]);

	if (!imageUploaded?.Key) {
		throw new Error(
			JSON.stringify({
				status: 500,
				message: 'Image not uploaded successfully',
			})
		);
	}

	const userUpdated = await updateUserIntoDb({ ...input, id: currentUser.user_id, imageKey: imageUploaded.Key }, client);

	return {
		...userUpdated,
		image: imageUploaded,
	};
}

async function selectCurrentUserFromDB(client: Client) {
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

async function updateUserIntoDb({ email, name, phone, direction, imageKey, id }: UpdateUserIntoDbInput, client: Client) {
	try {
		await client.execute({
			sql: `UPDATE users
                    SET
                        email = ?,
                        name = ?,
                        phone = ?,
                        direction = ?,
                        key_image = ?
                    WHERE user_id = ?;
                `,
			args: [email, name, phone, direction, imageKey, id],
		});

		const userDb = await client.execute({
			sql: `SELECT * FROM users WHERE user_id = ?;`,
			args: [id],
		});

		return userDb.rows[0] as unknown as UserDBResponse;
	} catch (error) {
		throw new Error(
			JSON.stringify({
				status: 500,
				message: `Error SQL: ${error instanceof Error ? error.message : 'Error updating user to DB'}`,
			})
		);
	}
}

export default updateUserInfra;
