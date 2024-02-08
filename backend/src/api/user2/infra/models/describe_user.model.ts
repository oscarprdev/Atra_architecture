import { Env } from '../../../..';
import { UserDb } from '../../shared/user_types';

export namespace DescribeUserInfra {
	export type Input = {
		env: Env;
	};

	export type Output = {
		user: UserDb;
	};
}
