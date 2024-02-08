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
}
