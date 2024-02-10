import { Env } from '../../../..';
import { UserResponse } from '../../shared/user_types';

export interface UpdatePasswordPorts {
	selectUserPassword(input: SelectUserPasswordPorts.Input): Promise<SelectUserPasswordPorts.Output>;
	updatePassword(input: UpdatePasswordPorts.Input): Promise<UpdatePasswordPorts.Output>;
}

export namespace SelectUserPasswordPorts {
	export type Input = {
		env: Env;
	};

	export type Output = {
		userId: string;
		passwordHashed: string;
	};
}

export namespace UpdatePasswordPorts {
	export type Input = {
		id: string;
		hashedPassword: string;
		env: Env;
	};

	export type Output = {
		user: UserResponse;
	};
}
