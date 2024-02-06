import { Client } from '@libsql/client/web';
import { UserDBResponse } from './user_types';

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

export default selectUserFromDb;
