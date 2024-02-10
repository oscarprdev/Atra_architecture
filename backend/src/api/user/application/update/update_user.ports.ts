import { Env } from '../../../..';
import { File, User } from '../../../generated';
import { UserResponse } from '../../shared/user_types';

export interface UpdateUserPorts {
	selectUser(input: SelectUserPortsTypes.Input): Promise<SelectUserPortsTypes.Output>;
	uploadImage(input: UploadImagePortsTypes.Input): Promise<UploadImagePortsTypes.Output>;
	deleteImage(input: DeleteImagePortsTypes.Input): Promise<void>;
	updateUser(input: UpdateUserPortsTypes.Input): Promise<UpdateUserPortsTypes.Output>;
}

export namespace SelectUserPortsTypes {
	export type Input = {
		env: Env;
	};

	export type Output = {
		user: UserResponse;
	};
}

export namespace UploadImagePortsTypes {
	export type Input = {
		file: File;
		key: string;
		type: string;
		env: Env;
	};

	export type Output = {
		image: File;
	};
}

export namespace DeleteImagePortsTypes {
	export type Input = {
		key: string;
		env: Env;
	};
}

export namespace UpdateUserPortsTypes {
	export type Input = {
		id: string;
		email: string;
		name: string;
		phone: number;
		direction: string;
		imageKey: string;
		env: Env;
	};

	export type Output = {
		user: UserResponse;
	};
}
