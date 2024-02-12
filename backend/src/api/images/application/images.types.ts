import { Env } from '../../..';
import { File } from '../../generated';

export namespace ImagesUsecasesTypes {
	export type GetImageByKeyInput = {
		key: string;
		env: Env;
	};

	export type GetImageByKeyOutput = {
		image: File;
	};

	export type UploadMainImageInput = {
		file: File;
		project: string;
		env: Env;
	};

	export type UploadMainImageOutput = {
		image: File;
	};

	export type UploadImagesInput = {
		files: File[];
		project: string;
		env: Env;
	};

	export type UploadImagesOutput = {
		images: File[];
	};

	export type DeleteImageByKeyInput = {
		key: string;
		env: Env;
	};
}
