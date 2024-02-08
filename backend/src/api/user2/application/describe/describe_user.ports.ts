import { Env } from '../../../..';
import { File } from '../../../generated';
import { UserResponse } from '../../shared/user_types';

export interface DescribeUserPorts {
	describeUser(input: DescribeUserPorts.Input): Promise<DescribeUserPorts.Output>;
	getImageByKey(input: GetImageByKeyPorts.Input): Promise<GetImageByKeyPorts.Output>;
}

export namespace DescribeUserPorts {
	export type Input = {
		env: Env;
	};

	export type Output = {
		user: UserResponse;
	};
}

export namespace GetImageByKeyPorts {
	export type Input = {
		key: string;
		env: Env;
	};

	export type Output = {
		image: File;
	};
}
