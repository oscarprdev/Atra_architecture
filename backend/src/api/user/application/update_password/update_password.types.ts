import { Env } from '../../../..';
import { User } from '../../../generated';

export namespace UpdatePasswordUsecasesTypes {
	export type UpdatePasswordInput = {
		oldPassword: string;
		newPassword: string;
		env: Env;
	};

	export type UpdatePasswordOutput = {
		user: User;
	};

	export type ValidatePasswordInput = {
		oldPassword: string;
		env: Env;
	};

	export type ValidatePasswordOutput = {
		user: User;
	};
}
