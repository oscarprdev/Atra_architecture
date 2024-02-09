import { Env } from '../../../..';
import { CreateUserBody, User } from '../../../generated';

export namespace CreateUserUsecasesTypes {
	export type Input = {
		userBody: CreateUserBody;
		env: Env;
	};

	export type Output = {
		user: User;
	};
}
