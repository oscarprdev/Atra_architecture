import { Client } from '@libsql/client/web';
import { Env } from '../../../..';
import buildLibsqlClient from '../../../../database';
import uploadImageToBucket from '../../../project/common/upload_image';
import { User } from '../user_upload_types';
import { InsertUserToDbInput, UploadUserInfraResponse, UserDBResponse } from './infra.types';
import hashPassword from '../../../../utils/hash_password';

async function uploadUserInfra({ email, password, name, phone, direction, image }: User, env: Env): Promise<UploadUserInfraResponse> {
	const client = buildLibsqlClient(env);

	const imageUploaded = await uploadImageToBucket(image, 'personal', env);

	const userDB = await insertUserToDb(
		{ email, password, name, phone, direction, imageKey: imageUploaded?.Key || '', salt: env.SALT },
		client
	);

	return {
		...userDB,
		image: imageUploaded,
	};
}

async function insertUserToDb(
	{ email, password, name, phone, direction, imageKey, salt }: InsertUserToDbInput,
	client: Client
): Promise<UserDBResponse> {
	try {
		const userId = crypto.randomUUID().toString();
		const hashedPassword = await hashPassword(password, salt);

		await client.execute({
			sql: `INSERT INTO users (user_id, email, password_hash, name, phone, direction, key_image)
            VALUES (?, ?, ?, ?, ?, ?, ?);`,
			args: [userId, email, hashedPassword, name, phone, direction, imageKey],
		});

		const userDb = await client.execute({
			sql: `SELECT * FROM users WHERE user_id = ?;`,
			args: [userId],
		});

		return userDb.rows[0] as unknown as UserDBResponse;
	} catch (error) {
		throw new Error(
			JSON.stringify({
				status: 500,
				message: `Error SQL: ${error instanceof Error ? error.message : 'Error inserting user to DB'}`,
			})
		);
	}
}

export default uploadUserInfra;
