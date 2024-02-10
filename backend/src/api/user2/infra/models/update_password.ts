import { Env } from '../../../..';
import { UserDb } from '../../shared/user_types';

export namespace UpdatePasswordInfra {
	export type Input = {
		userId: string;
		hashedPassword: string;
		env: Env;
	};

	export type Output = {
		user: UserDb;
	};
}
