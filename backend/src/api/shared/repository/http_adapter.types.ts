import { Env } from '../../..';
import { File } from '../../generated';

export namespace HttpAdapterTypes {
	export type GetImageByKeyInput = {
		key: string;
		env: Env;
	};

	export type GetImageByKeyOutput = {
		image: File;
	};

	export type UploadImageInput = {
		file: File;
		key: string;
		type: string;
		env: Env;
	};

	export type UploadImageOutput = {
		image: File;
	};

	export type DeleteItemByKeyPortsInput = {
		key: string;
		env: Env;
	};
}
