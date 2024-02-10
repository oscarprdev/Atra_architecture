import { Env } from '../../../..';

export namespace LoginUserUsecasesTypes {
	export type LoginUserInput = {
		password: string;
		email: string;
		env: Env;
	};

	export type LoginUserOutput = {
		token: string;
	};
}
