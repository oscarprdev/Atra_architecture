import generateImageKey from '../utils/generate_image_key';
import { ImagesPorts } from './images.ports';
import { ImagesUsecasesTypes } from './images.types';

export interface ImagesUsecases {
	getImageByKey(input: ImagesUsecasesTypes.GetImageByKeyInput): Promise<ImagesUsecasesTypes.GetImageByKeyOutput>;
	getImagesByEntity(input: ImagesUsecasesTypes.GetImagesByEntityInput): Promise<ImagesUsecasesTypes.GetImagesByEntityOutput>;

	uploadImage(input: ImagesUsecasesTypes.UploadMainImageInput): Promise<ImagesUsecasesTypes.UploadMainImageOutput>;
	uploadImages(input: ImagesUsecasesTypes.UploadImagesInput): Promise<ImagesUsecasesTypes.UploadImagesOutput>;

	deleteImageByKey(input: ImagesUsecasesTypes.DeleteImageByKeyInput): Promise<void>;
}

export class DefaultImagesUsecases implements ImagesUsecases {
	constructor(private readonly ports: ImagesPorts) {}

	async getImageByKey({ key, env }: ImagesUsecasesTypes.GetImageByKeyInput): Promise<ImagesUsecasesTypes.GetImageByKeyOutput> {
		const imageResponse = await this.ports.getImageByKey({ key, env });

		return {
			image: imageResponse.image,
		};
	}

	async getImagesByEntity({
		entity,
		env,
	}: ImagesUsecasesTypes.GetImagesByEntityInput): Promise<ImagesUsecasesTypes.GetImagesByEntityOutput> {
		return await this.ports.getImagesByEntity({ entity, env });
	}

	async uploadImage({ file, project, env }: ImagesUsecasesTypes.UploadMainImageInput): Promise<ImagesUsecasesTypes.UploadMainImageOutput> {
		const key = generateImageKey(project, file.name);

		return await this.ports.uploadImage({ file, key, type: file.type, env });
	}

	async uploadImages({ files, project, env }: ImagesUsecasesTypes.UploadImagesInput): Promise<ImagesUsecasesTypes.UploadImagesOutput> {
		const result = await Promise.all(files.map((image) => this.uploadImage({ file: image, project, env })));

		return {
			images: result.map((r) => r.image),
		};
	}

	async deleteImageByKey({ key, env }: ImagesUsecasesTypes.DeleteImageByKeyInput): Promise<void> {
		await this.ports.deleteImageByKey({ key, env });
	}
}
