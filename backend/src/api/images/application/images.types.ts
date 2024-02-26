import { Env } from '../../..';

export namespace ImagesUsecasesTypes {
	export type GetImageByKeyInput = {
		key: string;
		env: Env;
	};

	export type GetImageByKeyOutput = {
		image: File;
	};

	export type GetImagesByEntityInput = {
		entity: string;
		env: Env;
	};

	export type GetImagesByEntityOutput = {
		images: File[];
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
