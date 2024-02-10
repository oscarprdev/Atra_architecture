import { Env } from '../../../..';
import { UserDb } from '../../shared/user_types';

export namespace InsertUserInfra {
	export type Input = {
		email: string;
		name: string;
		passwordHashed: string;
		phone: number;
		direction: string;
		imageKey: string;
		env: Env;
	};

	export type Output = {
		user: UserDb;
	};
}
