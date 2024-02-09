import buildLibsqlClient from '../../../database';
import { UserDb } from '../shared/user_types';
import { DescribeUserInfra } from './models/describe_user.model';
import { UpdateUserInfra } from './models/update_user.model';

export interface UserInfra {
	describeUser(input: DescribeUserInfra.Input): Promise<DescribeUserInfra.Output>;
	updateUser(input: UpdateUserInfra.Input): Promise<UpdateUserInfra.Output>;
}

export class DefaultUserInfra implements UserInfra {
	constructor() {}

	async describeUser({ env }: DescribeUserInfra.Input): Promise<DescribeUserInfra.Output> {
		try {
			const client = buildLibsqlClient(env);

			const userDb = await client.execute({
				sql: `SELECT * FROM users;`,
				args: [],
			});

			return {
				user: userDb.rows[0] as unknown as UserDb,
			};
		} catch (error) {
			throw new Error(
				JSON.stringify({
					status: 500,
					message: `Error SQL: ${error instanceof Error ? error.message : 'Error selecting user from DB'}`,
				})
			);
		}
	}

	async updateUser({ email, name, phone, direction, imageKey, id, env }: UpdateUserInfra.Input): Promise<UpdateUserInfra.Output> {
		try {
			const client = buildLibsqlClient(env);

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

			return {
				user: userDb.rows[0] as unknown as UserDb,
			};
		} catch (error) {
			throw new Error(
				JSON.stringify({
					status: 500,
					message: `Error SQL: ${error instanceof Error ? error.message : 'Error updating user to DB'}`,
				})
			);
		}
	}
}
