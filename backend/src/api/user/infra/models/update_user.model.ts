import { Env } from '../../../..';
import { UserDb } from '../../shared/user_types';

export namespace UpdateUserInfra {
	export type Input = {
		id: string;
		email: string;
		name: string;
		phone: number;
		direction: string;
		description: string;
		imageKey: string;
		env: Env;
	};

	export type Output = {
		user: UserDb;
	};
}
