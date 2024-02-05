import { Client } from '@libsql/client/web';
import { Env } from '../../../..';
import buildLibsqlClient from '../../../../database';
import { UserPasswordUpdateInput } from '../user_update_password_types';
import { UserDBResponse } from '../../common/user_types';
import verifyOldPassword from '../../../../utils/verify_password';
import hashPassword from '../../../../utils/hash_password';

async function updatePasswordUserInfra(input: UserPasswordUpdateInput, env: Env): Promise<UserDBResponse> {
	const client = buildLibsqlClient(env);

	const userdb = await selectUserFromDb(client);

	const isPasswordValid = await verifyOldPassword(input.oldPassword, env.SALT, userdb.password_hash);

	if (!isPasswordValid) {
		throw new Error(
			JSON.stringify({
				status: 400,
				message: 'Password not valid',
			})
		);
	}

	return await updatePasswordUserIntoDb({ id: userdb.user_id, password: input.newPassword }, client, env);
}

async function selectUserFromDb(client: Client): Promise<UserDBResponse> {
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

async function updatePasswordUserIntoDb({ id, password }: UpdatePasswordUserIntoDbInput, client: Client, env: Env) {
	try {
		const hashedPassword = await hashPassword(password, env.SALT);

		await client.execute({
			sql: `UPDATE users
                    SET
                        password_hash = ?
                    WHERE user_id = ?;
                `,
			args: [hashedPassword, id],
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

export default updatePasswordUserInfra;
