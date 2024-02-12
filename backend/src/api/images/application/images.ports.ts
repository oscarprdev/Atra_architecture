import { Env } from '../../..';
import { File } from '../../generated';

export interface ImagesPorts {
	uploadImage(input: UploadImagePorts.Input): Promise<UploadImagePorts.Output>;
	getImageByKey(input: GetImageByKeyPorts.Input): Promise<GetImageByKeyPorts.Output>;
	deleteImageByKey(input: DeleteImageByKeyPorts.Input): Promise<void>;
}

export namespace UploadImagePorts {
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

export namespace GetImageByKeyPorts {
	export type Input = {
		key: string;
		env: Env;
	};

	export type Output = {
		image: File;
	};
}

export namespace DeleteImageByKeyPorts {
	export type Input = {
		key: string;
		env: Env;
	};
}
