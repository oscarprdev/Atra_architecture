import { Env } from '../../../..';

export interface LoginUserPorts {
	selectUserAuthInfo(input: SelectUserAuthInfoPortsTypes.Input): Promise<SelectUserAuthInfoPortsTypes.Output>;
}

export namespace SelectUserAuthInfoPortsTypes {
	export type Input = {
		env: Env;
	};

	export type Output = {
		name: string;
		emailDb: string;
		passwordDb: string;
	};
}
