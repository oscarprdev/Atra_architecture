import generateImageKey from '../utils/generate_image_key';
import { ImagesPorts } from './images.ports';
import { ImagesUsecasesTypes } from './images.types';

export interface ImagesUsecases {
	getImageByKey(input: ImagesUsecasesTypes.GetImageByKeyInput): Promise<ImagesUsecasesTypes.GetImageByKeyOutput>;
	uploadImage(input: ImagesUsecasesTypes.UploadMainImageInput): Promise<ImagesUsecasesTypes.UploadMainImageOutput>;
	uploadImages(input: ImagesUsecasesTypes.UploadImagesInput): Promise<ImagesUsecasesTypes.UploadImagesOutput>;
	deleteImageByKey(input: ImagesUsecasesTypes.DeleteImageByKeyInput): Promise<void>;
}

export class DefaultImagesUsecases implements ImagesUsecases {
	constructor(private readonly ports: ImagesPorts) {}

	async getImageByKey({ key, env }: ImagesUsecasesTypes.GetImageByKeyInput): Promise<ImagesUsecasesTypes.GetImageByKeyOutput> {
		return await this.ports.getImageByKey({ key, env });
	}

	async uploadImage({ file, project, env }: ImagesUsecasesTypes.UploadMainImageInput): Promise<ImagesUsecasesTypes.UploadMainImageOutput> {
		const key = generateImageKey(project);
		const type = file.Type || 'image/jpg';

		return await this.ports.uploadImage({ file, key, type, env });
	}

	async uploadImages({ files, project, env }: ImagesUsecasesTypes.UploadImagesInput): Promise<ImagesUsecasesTypes.UploadImagesOutput> {
		const key = generateImageKey(project);

		const result = await Promise.all(
			files.map((image) => this.ports.uploadImage({ file: image, key, type: image.Type || 'image/jpg', env }))
		);

		return {
			images: result.map((r) => r.image),
		};
	}

	async deleteImageByKey({ key, env }: ImagesUsecasesTypes.DeleteImageByKeyInput): Promise<void> {
		await this.ports.deleteImageByKey({ key, env });
	}
}
