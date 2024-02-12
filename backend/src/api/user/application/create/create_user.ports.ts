import { Env } from '../../../..';
import { File } from '../../../generated';
import { UserResponse } from '../../shared/user_types';

export interface CreateUserPorts {
	uploadImage(input: UploadImagePortsTypes.Input): Promise<UploadImagePortsTypes.Output>;
	insertUser(input: CreateUserPortsTypes.Input): Promise<CreateUserPortsTypes.Output>;
}

export namespace CreateUserPortsTypes {
	export type Input = {
		email: string;
		name: string;
		passwordHashed: string;
		phone: number;
		direction: string;
		imageKey: string;
		env: Env;
	};

	export type Output = {
		user: UserResponse;
	};
}

export namespace UploadImagePortsTypes {
	export type Input = {
		file: File;
		project: string;
		env: Env;
	};

	export type Output = {
		image: File;
	};
}
