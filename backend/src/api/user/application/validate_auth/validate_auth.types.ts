import { Env } from '../../../..';

export namespace ValidateAuthUsecasesTypes {
	export type ValidateAuthInput = {
		token: string;
		env: Env;
	};

	export type ValidateAuthOutput = {
		token: string;
	};
}
