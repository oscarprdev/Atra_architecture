import { Env } from '../../../..';
import { User } from '../../../generated';

export namespace DescribeUserUsecaseTypes {
	export type Input = {
		env: Env;
	};

	export type Output = {
		user: User;
	};
}
