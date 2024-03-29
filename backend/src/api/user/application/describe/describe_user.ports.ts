import { Env } from '../../../..';
import { UserResponse } from '../../shared/user_types';

export interface DescribeUserPorts {
	describeUser(input: DescribeUserPorts.Input): Promise<DescribeUserPorts.Output>;
	getUserImage(input: GetUserImagePorts.Input): Promise<GetUserImagePorts.Output>;
}

export namespace DescribeUserPorts {
	export type Input = {
		env: Env;
	};

	export type Output = {
		user: UserResponse;
	};
}

export namespace GetUserImagePorts {
	export type Input = {
		key: string;
		env: Env;
	};

	export type Output = {
		image: File;
	};
}
