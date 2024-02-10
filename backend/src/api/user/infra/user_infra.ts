import buildLibsqlClient from '../../../database';
import { UserDb } from '../shared/user_types';
import { DescribeUserInfra } from './models/describe_user.model';
import { InsertUserInfra } from './models/insert_user.model';
import { UpdatePasswordInfra } from './models/update_password';
import { UpdateUserInfra } from './models/update_user.model';

export interface UserInfra {
	describeUser(input: DescribeUserInfra.Input): Promise<DescribeUserInfra.Output>;
	updateUser(input: UpdateUserInfra.Input): Promise<UpdateUserInfra.Output>;
	insertUser(input: InsertUserInfra.Input): Promise<InsertUserInfra.Output>;
	updatePassword(input: UpdatePasswordInfra.Input): Promise<UpdatePasswordInfra.Output>;
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

	async insertUser({
		email,
		passwordHashed,
		name,
		phone,
		direction,
		imageKey,
		env,
	}: InsertUserInfra.Input): Promise<InsertUserInfra.Output> {
		try {
			const client = buildLibsqlClient(env);
			const userId = crypto.randomUUID().toString();

			await client.execute({
				sql: `INSERT INTO users (
					user_id, 
					email, 
					password_hash, 
					name, 
					phone, 
					direction, 
					key_image
					)
				VALUES (?, ?, ?, ?, ?, ?, ?);`,
				args: [userId, email, passwordHashed, name, phone, direction, imageKey],
			});

			const userDb = await client.execute({
				sql: `SELECT * FROM users WHERE user_id = ?;`,
				args: [userId],
			});

			return {
				user: userDb.rows[0] as unknown as UserDb,
			};
		} catch (error) {
			throw new Error(
				JSON.stringify({
					status: 500,
					message: `Error SQL: ${error instanceof Error ? error.message : 'Error inserting user to DB'}`,
				})
			);
		}
	}

	async updatePassword({ hashedPassword, userId, env }: UpdatePasswordInfra.Input): Promise<UpdatePasswordInfra.Output> {
		try {
			const client = buildLibsqlClient(env);

			await client.execute({
				sql: `UPDATE users
						SET
							password_hash = ?
						WHERE user_id = ?;
					`,
				args: [hashedPassword, userId],
			});

			const userDb = await client.execute({
				sql: `SELECT * FROM users WHERE user_id = ?;`,
				args: [userId],
			});

			return {
				user: userDb.rows[0] as unknown as UserDb,
			};
		} catch (error) {
			throw new Error(
				JSON.stringify({
					status: 500,
					message: `Error SQL: ${error instanceof Error ? error.message : 'Error updating user password to DB'}`,
				})
			);
		}
	}
}
